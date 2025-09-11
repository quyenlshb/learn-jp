// src/LearnNew.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebaseClient";

const LearnNew = () => {
  const { id } = useParams(); // courseId
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [limit, setLimit] = useState(10); // số từ mặc định
  const [step, setStep] = useState("select"); // select | learn | done
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showKana, setShowKana] = useState(false);

  // lấy từ chưa học
  useEffect(() => {
    const fetchWords = async () => {
      const snap = await getDocs(collection(db, "courses", id, "words"));
      const allWords = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const progressSnap = await getDocs(
        collection(db, "users", auth.currentUser.uid, "progress")
      );
      const progress = progressSnap.docs.map((d) => d.id);

      // lọc ra từ chưa học
      const newWords = allWords.filter((w) => !progress.includes(w.id));

      setWords(newWords);
    };

    fetchWords();
  }, [id]);

  // tạo lựa chọn
  useEffect(() => {
    if (step === "learn" && words.length > 0) {
      generateOptions(words[currentIndex]);
    }
  }, [step, currentIndex, words]);

  const generateOptions = (word) => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const wrongs = shuffled
      .filter((w) => w.id !== word.id)
      .slice(0, 3)
      .map((w) => w.meaning);

    const opts = [...wrongs, word.meaning].sort(() => 0.5 - Math.random());
    setOptions(opts);
    setSelected(null);
    setFeedback("");
    setShowKana(false);
  };

  const speakWord = (word) => {
    if (!word) return;
    const utter = new SpeechSynthesisUtterance(word.kana || word.kanji);
    utter.lang = "ja-JP";
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const saveProgress = async (word, isCorrect) => {
    const now = new Date();
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
        nextDue: new Date(now.getTime() + 24 * 60 * 60 * 1000), // ngày mai
      },
      { merge: true }
    );
  };

  const handleAnswer = async (choice) => {
    const word = words[currentIndex];
    const isCorrect = choice === word.meaning;

    setSelected(choice);
    setShowKana(true);
    speakWord(word);

    setFeedback(
      isCorrect
        ? "🌱 Chính xác! Hạt giống đang nảy mầm 🌿"
        : `🥀 Sai rồi. Đáp án đúng: ${word.meaning}`
    );

    await saveProgress(word, isCorrect);

    setTimeout(() => {
      if (currentIndex + 1 < Math.min(limit, words.length)) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setStep("done");
      }
    }, 1500);
  };

  // Bước chọn số lượng
  if (step === "select") {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>Chọn số lượng từ để học hôm nay</h2>
        {[5, 10, 20].map((num) => (
          <button
            key={num}
            onClick={() => {
              setLimit(num);
              setStep("learn");
            }}
            style={{
              margin: "10px",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              background: "#2196F3",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {num} từ
          </button>
        ))}
      </div>
    );
  }

  // Bước học
  if (step === "learn" && words.length > 0) {
    const word = words[currentIndex];

    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>
          Học từ mới {currentIndex + 1}/{Math.min(limit, words.length)}
        </h2>

        <div
          style={{
            margin: "30px auto",
            padding: "40px",
            border: "2px solid #333",
            borderRadius: "10px",
            width: "300px",
            fontSize: "28px",
          }}
        >
          {word.kanji || word.kana}
          {showKana && (
            <p style={{ fontSize: "20px", marginTop: "15px", color: "#555" }}>
              {word.kana}
            </p>
          )}
        </div>

        <div>
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={!!selected}
              style={{
                display: "block",
                margin: "10px auto",
                padding: "10px 20px",
                width: "250px",
                background:
                  selected === opt
                    ? opt === word.meaning
                      ? "#4CAF50"
                      : "#f44336"
                    : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {feedback && <p style={{ marginTop: "15px" }}>{feedback}</p>}
      </div>
    );
  }

  // Bước hoàn thành
  if (step === "done") {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>🎉 Hoàn thành buổi học!</h2>
        <p>Bạn đã gieo hạt thành công cho {Math.min(limit, words.length)} từ mới 🌱</p>
        <button
          onClick={() => navigate(`/course/${id}`)}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            background: "#2196F3",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Quay về khóa học
        </button>
      </div>
    );
  }

  return <p>Đang tải...</p>;
};

export default LearnNew;
