// src/Review.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebaseClient";
import { addScore, updateStreakOnActivity } from "./firebaseHelpers";


const Review = () => {
  const { id } = useParams(); // courseId
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showKana, setShowKana] = useState(false);
  const [loading, setLoading] = useState(true);

  // ly danh sch t cn n
  useEffect(() => {
    const fetchDueWords = async () => {
      try {
        const snap = await getDocs(
          collection(db, "users", auth.currentUser.uid, "progress")
        );
        const allProgress = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const dueWords = allProgress.filter(
          (w) => w.courseId === id && w.nextDue && new Date(w.nextDue) <= new Date()
        );

        setWords(dueWords);
        setLoading(false);
      } catch (error) {
        console.error("Li ti t cn n:", error);
        setLoading(false);
      }
    };

    fetchDueWords();
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

  // cp nht tin  v nh du  hc
  const updateProgress = async (word, isCorrect) => {
    const now = new Date();
    let interval = word.intervalDays || 1;
    let EF = word.EF || 2.5;

    if (isCorrect) {
      interval = Math.round(interval * EF);
      EF = Math.min(EF + 0.1, 3);
    } else {
      interval = 1;
      EF = Math.max(EF - 0.3, 1.3);
    }

    // 1 Cp nht progress user
    await setDoc(
      doc(db, "users", auth.currentUser.uid, "progress", word.id),
      {
        ...word,
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

    // 2 nh du isLearned trong words
    await updateDoc(doc(db, "courses", id, "words", word.id), {
      isLearned: true,
    });
  \n    try{ if (auth && auth.currentUser) { addScore(auth.currentUser.uid, auth.currentUser.displayName || auth.currentUser.email, 5); updateStreakOnActivity(auth.currentUser.uid); } }catch(e){}\n};

  const handleAnswer = async (choice) => {
    setSelected(choice);
    setShowKana(true);

    const word = words[currentIndex];
    speakWord(word);

    const isCorrect = choice === word.meaning;
    setFeedback(isCorrect ? " Chnh xc!" : ` Sai. ng: ${word.meaning}`);

    await updateProgress(word, isCorrect);

    setTimeout(() => {
      if (currentIndex + 1 < words.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        alert("Hon thnh bui n tp!");
        navigate(`/course/${id}`);
      }
    }, 1500);
  };

  if (loading) return <p>ang ti...</p>;
  if (words.length === 0)
    return <p style={{ textAlign: "center", marginTop: "40px" }}> Khng c t no cn n hm nay</p>;

  const word = words[currentIndex];

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>n tp t  hc</h2>
      <p>
        T {currentIndex + 1}/{words.length}
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
           Nghe li
        </button>
      )}
    </div>
  );
};

export default Review;
