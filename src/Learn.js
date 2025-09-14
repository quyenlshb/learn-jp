// src/Learn.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "./firebaseClient";

const Learn = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allWords, setAllWords] = useState([]);
  const [learningWords, setLearningWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [lastWordId, setLastWordId] = useState(null);
  const [choices, setChoices] = useState([]);
  const [step, setStep] = useState("loading"); // loading | select-limit | running | empty
  const [limit, setLimit] = useState(0);

  // streaks[wordId] = số lần đúng liên tiếp
  const [streaks, setStreaks] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "courses", id, "words"));
        const words = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // chỉ lấy từ chưa học
        const newWords = words.filter((w) => !w.isLearned);

        if (!newWords || newWords.length === 0) {
          setStep("empty");
        } else {
          setAllWords(newWords);
          setStep("select-limit");
        }
      } catch (err) {
        console.error("Error loading words:", err);
        setStep("empty");
      }
    };
    fetchData();
  }, [id]);

  const pickNextWord = () => {
    const notMastered = learningWords.filter(
      (w) => (streaks[w.id] || 0) < 4
    );
    if (notMastered.length === 0) {
      setStep("empty");
      return null;
    }

    let candidates = notMastered.filter((w) => w.id !== lastWordId);
    if (candidates.length === 0) candidates = notMastered;

    const next =
      candidates[Math.floor(Math.random() * candidates.length)];
    setLastWordId(next.id);

    // tạo đáp án lựa chọn
    const others = learningWords.filter((w) => w.id !== next.id);
    const randomChoices = [
      next.meaning,
      ...others
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.meaning),
    ].sort(() => Math.random() - 0.5);

    setCurrentWord(next);
    setChoices(randomChoices);
    return next;
  };

  const handleAnswer = async (choice) => {
    if (!currentWord) return;
    const isCorrect = choice === currentWord.meaning;

    setStreaks((prev) => {
      const current = prev[currentWord.id] || 0;
      const next = isCorrect ? current + 1 : 0;
      return { ...prev, [currentWord.id]: next };
    });

    // nếu đủ 4 lần liên tiếp thì đánh dấu mastered
    if (isCorrect) {
      const newStreak = (streaks[currentWord.id] || 0) + 1;
      if (newStreak >= 4) {
        try {
          await updateDoc(
            doc(db, "courses", id, "words", currentWord.id),
            { isLearned: true }
          );
          if (auth.currentUser) {
            await setDoc(
              doc(
                db,
                "users",
                auth.currentUser.uid,
                "progress",
                currentWord.id
              ),
              { mastered: true, lastReviewed: new Date() }
            );
          }
        } catch (err) {
          console.error("Error updating progress:", err);
        }
      }
    }

    setTimeout(() => pickNextWord(), 500);
  };

  if (step === "loading") return <p>Đang tải...</p>;

  if (step === "empty")
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <p>Không còn từ mới để học.</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );

  if (step === "select-limit")
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h3>Bạn muốn học bao nhiêu từ hôm nay?</h3>
        {[5, 10, 15].map((num) => (
          <button
            key={num}
            onClick={() => {
              setLimit(num);
              setLearningWords(allWords.slice(0, num));
              setStep("running");
              setTimeout(() => pickNextWord(), 200);
            }}
            style={{ margin: 8, padding: "10px 16px", borderRadius: 6 }}
          >
            {num} từ
          </button>
        ))}
      </div>
    );

  if (step === "running" && currentWord)
    return (
      <div
        style={{
          maxWidth: 400,
          margin: "40px auto",
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 12,
        }}
      >
        <h2 style={{ marginBottom: 20 }}>{currentWord.word}</h2>
        {choices.map((c) => (
          <button
            key={c}
            onClick={() => handleAnswer(c)}
            style={{
              display: "block",
              margin: "8px auto",
              padding: "10px 16px",
              borderRadius: 6,
              width: "100%",
            }}
          >
            {c}
          </button>
        ))}
        <p style={{ marginTop: 20, fontSize: 14, color: "#555" }}>
          Đúng liên tiếp 4 lần để thuộc từ.
        </p>
      </div>
    );

  return null;
};

export default Learn;
