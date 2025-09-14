// src/SpeedReview.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebaseClient";

const SpeedReview = () => {
  const { id } = useParams(); // courseId
  const navigate = useNavigate();

  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 giây
  const [gameOver, setGameOver] = useState(false);

  // 👉 Lấy dữ liệu từ progress trước, nếu rỗng thì fallback sang courses
  useEffect(() => {
    const fetchWords = async () => {
      let fetched = [];

      // 1. Thử lấy từ progress
      const snap = await getDocs(
        collection(db, "users", auth.currentUser.uid, "progress")
      );
      const allProgress = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      fetched = allProgress.filter((w) => w.courseId === id);

      // 2. Nếu progress rỗng → fallback sang toàn bộ từ trong course
      if (fetched.length === 0) {
        const courseSnap = await getDocs(collection(db, "courses", id, "words"));
        fetched = courseSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }

      setWords(fetched);
    };

    fetchWords();
  }, [id]);

  useEffect(() => {
    if (words.length > 0) {
      generateOptions(words[currentIndex]);
    }
  }, [words, currentIndex]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const generateOptions = (word) => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const wrongs = shuffled
      .filter((w) => w.id !== word.id)
      .slice(0, 3)
      .map((w) => w.meaning);

    const opts = [...wrongs, word.meaning].sort(() => 0.5 - Math.random());
    setOptions(opts);
    setSelected(null);
  };

  const updateProgress = async (word, isCorrect) => {
    const now = new Date();
    let interval = word.intervalDays || 1;
    let EF = word.EF || 2.0;

    if (isCorrect) {
      interval = Math.round(interval * EF);
      EF = Math.min(EF + 0.05, 3);
    } else {
      interval = 1;
      EF = Math.max(EF - 0.2, 1.3);
    }

    // 1️⃣ update progress
    await setDoc(
      doc(db, "users", auth.currentUser.uid, "progress", word.id),
      {
        ...word,
        courseId: id,
        timesSeen: (word.timesSeen || 0) + 1,
        timesCorrect: (word.timesCorrect || 0) + (isCorrect ? 1 : 0),
        wrongCount: (word.wrongCount || 0) + (isCorrect ? 0 : 1),
        intervalDays: interval,
        EF,
        lastReviewed: now,
        nextDue: new Date(now.getTime() + interval * 24 * 60 * 60 * 1000),
      },
      { merge: true }
    );

    // 2️⃣ đánh dấu đã học trong course
    await updateDoc(doc(db, "courses", id, "words", word.id), {
      isLearned: true,
    });
  };

  const handleAnswer = async (choice) => {
    const word = words[currentIndex];
    const isCorrect = choice === word.meaning;

    setSelected(choice);

    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setScore((s) => Math.max(s - 1, 0));
    }

    await updateProgress(word, isCorrect);

    setTimeout(() => {
      if (currentIndex + 1 < words.length && timeLeft > 0) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setGameOver(true);
      }
    }, 800);
  };

  if (gameOver) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>⏱ Hết giờ!</h2>
        <p>Điểm số của bạn: {score}</p>
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

  if (words.length === 0) return <p>Không có từ nào để luyện.</p>;

  const word = words[currentIndex];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Ôn tập nhanh</h2>
      <p>⏳ Thời gian: {timeLeft}s</p>
      <p>⭐ Điểm: {score}</p>
      <p>
        Câu {currentIndex + 1}/{words.length}
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
    </div>
  );
};

export default SpeedReview;
