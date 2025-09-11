// src/LearnNew.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebaseClient";

const LearnNew = () => {
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
    const fetchNewWords = async () => {
      try {
        const q = query(collection(db, "words"), where("courseId", "==", id));
        const snapshot = await getDocs(q);
        const allWords = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const progressSnap = await getDocs(
          collection(db, "users", auth.currentUser.uid, "progress")
        );
        const learnedIds = progressSnap.docs.map((d) => d.id);

        const newWords = allWords.filter((w) => !learnedIds.includes(w.id));
        setWords(newWords.slice(0, 10));
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải từ mới:", error);
      }
    };

    fetchNewWords();
  }, [id]);

  useEffect(() => {
    if (words.length > 0) {
      generateOptions(words[currentIndex]);
    }
  }, [words, currentIndex]);

  const generateOptions = (word) => {
    const pool = words.filter((w) => w.id !== word.id);
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const wrongs = shuffled.slice(0, 3).map((w) => w.meaning);

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

  const handleAnswer = async (choice) => {
    setSelected(choice);
    setShowKana(true);

    // Phát âm từ sau khi chọn đáp án
    speakWord(words[currentIndex]);

    if (choice === words[currentIndex].meaning) {
      setFeedback("✅ Chính xác!");
      const word = words[currentIndex];
      await setDoc(
        doc(db, "users", auth.currentUser.uid, "progress", word.id),
        {
          courseId: id,
          timesSeen: 1,
          timesCorrect: 1,
          wrongCount: 0,
          correctStreak: 1,
          incorrectStreak: 0,
          intervalDays: 1,
          EF: 2.5,
          lastReviewed: new Date(),
          nextDue: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: "learning",
        }
      );
    } else {
      setFeedback(`❌ Sai. Đúng là: ${words[currentIndex].meaning}`);
    }

    setTimeout(() => {
      if (currentIndex + 1 < words.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        alert("Hoàn thành buổi học từ mới!");
        navigate(`/course/${id}`);
      }
    }, 1500);
  };

  if (loading) return <p>Đang tải...</p>;
  if (words.length === 0) return <p>Không còn từ mới để học.</p>;

  const word = words[currentIndex];

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Học từ mới (Trắc nghiệm)</h2>
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
          position: "relative",
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

      {/* Nút nghe lại */}
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

export default LearnNew;
