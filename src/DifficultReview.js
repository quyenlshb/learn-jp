// src/DifficultReview.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebaseClient";

const DifficultReview = () => {
  const { id } = useParams(); // courseId
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showKana, setShowKana] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDifficultWords = async () => {
      try {
        const snap = await getDocs(
          collection(db, "users", auth.currentUser.uid, "progress")
        );
        const allProgress = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // lấy từ trong đúng khóa học, sai nhiều lần
        const hardWords = allProgress.filter((w) => {
          return w.courseId === id && (w.wrongCount || 0) >= 2;
        });

        setWords(hardWords);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải từ khó:", error);
      }
    };

    fetchDifficultWords();
  }, [id]);

  useEffect(() => {
    if (words.length > 0) {
      generateOptions(words[currentIndex]);
    }
  }, [words, currentIndex]);

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

  const updateProgress = async (word, isCorrect) => {
    const now = new Date();

    await setDoc(
      doc(db, "users", auth.currentUser.uid, "progress", word.id),
      {
        ...word,
        timesSeen: (word.timesSeen || 0) + 1,
        timesCorrect: (word.timesCorrect || 0) + (isCorrect ? 1 : 0),
        wrongCount: (word.wrongCount || 0) + (isCorrect ? 0 : 1),
        lastReviewed: now,
      },
      { merge: true }
    );
  };

  const handleAnswer = async (choice) => {
    setSelected(choice);
    setShowKana(true);

    speakWord(words[currentIndex]);

    const isCorrect = choice === words[currentIndex].meaning;
    setFeedback(isCorrect ? "✅ Chính xác!" : `❌ Sai. Đúng: ${words[currentIndex].meaning}`);

    await updateProgress(words[currentIndex], isCorrect);

    setTimeout(() => {
      if (currentIndex + 1 < words.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        alert("Hoàn thành ôn từ khó!");
        navigate(`/course/${id}`);
      }
    }, 1500);
  };

  if (loading) return <p>Đang tải...</p>;
  if (words.length === 0) return <p>Không có từ nào bị sai nhiều 🎉</p>;

  const word = words[currentIndex];

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Ôn tập từ khó</h2>
      <p>
        Từ {currentIndex + 1}/{words.length}
      </p>

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

      <div style={{ marginTop: "20px" }}>
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

      {showKana && (
        <button
          onClick={() => speakWord(word)}
          style={{
            marginTop: "20px",
            padding: "8px 16px",
            background: "#FF9800",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🔊 Nghe lại
        </button>
      )}
    </div>
  );
};

export default DifficultReview;
