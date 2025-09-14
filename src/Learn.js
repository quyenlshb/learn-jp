// src/Learn.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "./firebaseClient";
import { useToast } from "./ToastManager";
import { addPoints } from "./utils/points";
import { addDifficultWord } from "./utils/difficultWords";

/*
  Learn.js (gộp từ Learn.js + LearnNew.js, loại bỏ "điền từ")
  - Hiển thị từ mới (kanji/kana/romaji/meaning)
  - Sau phần giới thiệu, chuyển sang câu hỏi multiple choice (4 lựa chọn)
  - Lưu tiến độ vào users/{uid}/progress và cập nhật courses/{courseId}/words/{wordId}.isLearned
  - Cập nhật điểm (addPoints) và danh sách từ khó (addDifficultWord)
*/

const Learn = () => {
  const { id } = useParams(); // courseId
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState("loading"); // loading | select | running | done | empty
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [limit, setLimit] = useState(20);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showKana, setShowKana] = useState(false);
  const [loadingChoice, setLoadingChoice] = useState(false);

  useEffect(() => {
    if (!id) {
      setStep("empty");
      return;
    }

    const fetchWords = async () => {
      try {
        const snap = await getDocs(collection(db, "courses", id, "words"));
        const allWords = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Lấy progress để lọc từ đã học
        let progress = [];
        if (auth?.currentUser?.uid) {
          const progSnap = await getDocs(
            collection(db, "users", auth.currentUser.uid, "progress")
          );
          progress = progSnap.docs.map((d) => d.id);
        }

        // Chỉ lấy từ chưa học
        const newWords = allWords.filter((w) => !progress.includes(w.id));

        if (!newWords || newWords.length === 0) {
          setStep("empty");
        } else {
          // shuffle và cắt theo limit
          const shuffled = newWords.sort(() => Math.random() - 0.5);
          setWords(shuffled.slice(0, Math.min(limit, shuffled.length)));
          setStep("running");
        }
      } catch (err) {
        console.error("Lỗi tải từ mới:", err);
        setStep("empty");
      }
    };

    fetchWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // tạo 4 lựa chọn multiple choice (1 đúng + 3 distractors)
  useEffect(() => {
    const makeChoices = () => {
      if (!words.length) return;
      const word = words[currentIndex];
      // lấy 3 distractor ngẫu nhiên từ toàn bộ words (không trùng)
      const pool = words
        .map((w) => w.meaning)
        .filter((m) => m && m !== word.meaning);
      const shuffled = pool.sort(() => Math.random() - 0.5);
      const distractors = shuffled.slice(0, 3);
      const opts = [word.meaning, ...distractors].sort(() => Math.random() - 0.5);
      setChoices(opts);
      setSelected(null);
      setFeedback("");
      setShowKana(false);
    };
    makeChoices();
  }, [words, currentIndex]);

  const speakWord = (word) => {
    try {
      if (!word) return;
      const utter = new SpeechSynthesisUtterance(word.kana || word.kanji || word.romaji || "");
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (e) {
      // ignore speech errors
    }
  };

  const saveProgress = async (word, isCorrect) => {
    if (!auth?.currentUser?.uid) return;
    const now = new Date();
    try {
      await setDoc(
        doc(db, "users", auth.currentUser.uid, "progress", word.id),
        {
          ...word,
          courseId: id,
          status: isCorrect ? "learning" : "difficult",
          timesSeen: 1,
          timesCorrect: isCorrect ? 1 : 0,
          wrongCount: isCorrect ? 0 : 1,
          intervalDays: 1,
          EF: 2.5,
          lastReviewed: now,
          nextDue: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        },
        { merge: true }
      );
      // đánh dấu là đã học trong course words
      await updateDoc(doc(db, "courses", id, "words", word.id), {
        isLearned: true,
      });
    } catch (err) {
      console.error("Lỗi lưu progress:", err);
    }
  };

  const handleChoice = async (choice) => {
    if (loadingChoice) return;
    setLoadingChoice(true);
    const word = words[currentIndex];
    const isCorrect = choice === word.meaning;
    setSelected(choice);
    setShowKana(true);
    speakWord(word);

    setFeedback(
      isCorrect ? "🌱 Chính xác! Hạt giống đang nảy mầm 🌿" : `🥀 Sai rồi. Đáp án đúng: ${word.meaning}`
    );

    // lưu progress
    await saveProgress(word, isCorrect);

    // update điểm / difficult list
    try {
      if (isCorrect && auth?.currentUser?.uid) {
        await addPoints(auth.currentUser.uid, 10, { courseId: id || null });
        try { toast.push("+10"); } catch(e) {}
      } else if (!isCorrect && auth?.currentUser?.uid) {
        await addDifficultWord(auth.currentUser.uid, word);
      }
    } catch (err) {
      console.error(err);
    }

    // chuyển câu tiếp theo sau delay
    setTimeout(() => {
      if (currentIndex + 1 < Math.min(limit, words.length)) {
        setCurrentIndex((c) => c + 1);
      } else {
        setStep("done");
      }
      setLoadingChoice(false);
    }, 1200);
  };

  // UI: handling states
  if (step === "loading") {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>⏳ Đang tải...</p>;
  }

  if (step === "empty") {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <p>🎉 Không còn từ mới trong khoá học này hoặc bạn đã học hết.</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            background: "#1976d2",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Quay lại
        </button>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h3>Hoàn thành buổi học 🎉</h3>
        <p>Bạn đã hoàn tất {Math.min(limit, words.length)} từ.</p>
        <button
          onClick={() => navigate(`/course/${id}`)}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            background: "#1976d2",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Về khoá học
        </button>
      </div>
    );
  }

  // running
  const currentWord = words[currentIndex];

  return (
    <div style={{ maxWidth: 700, margin: "20px auto", textAlign: "center" }}>
      <h2>
        Học từ mới {currentIndex + 1}/{Math.min(limit, words.length)}
      </h2>

      <div
        style={{
          margin: "20px auto",
          padding: 20,
          borderRadius: 8,
          border: "1px solid #eee",
          minHeight: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 48 }}>
          {currentWord.kanji || currentWord.kana}
        </div>

        {showKana && (
          <p style={{ fontSize: 20, marginTop: 10, color: "#555" }}>
            {currentWord.kana ? `${currentWord.kana} · ${currentWord.romaji || ""}` : (currentWord.romaji || "")}
          </p>
        )}

        {!showKana && (
          <p style={{ marginTop: 12, color: "#777" }}>
            (Nhấn 1 lựa chọn để hiện âm/kana và xem kết quả)
          </p>
        )}
      </div>

      <div style={{ marginTop: 10 }}>
        {choices.map((c, idx) => {
          const isSelected = selected === c;
          const isCorrect = currentWord && c === currentWord.meaning;
          let bg = "#fff";
          if (selected) {
            if (isSelected) bg = isCorrect ? "#4caf50" : "#f44336";
            else if (isCorrect) bg = "#4caf50";
          }
          return (
            <button
              key={idx}
              onClick={() => handleChoice(c)}
              disabled={!!selected || loadingChoice}
              style={{
                display: "block",
                margin: "10px auto",
                padding: "10px 20px",
                width: 360,
                borderRadius: 6,
                border: "1px solid #ddd",
                cursor: selected ? "default" : "pointer",
                background: bg,
                color: bg === "#fff" ? "#000" : "#fff",
                fontSize: 16,
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 12 }}>
        <p style={{ minHeight: 24 }}>{feedback}</p>
      </div>
    </div>
  );
};

export default Learn;
