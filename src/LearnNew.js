// src/LearnNew.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebaseClient";
import { addScore, updateStreakOnActivity } from "./firebaseHelpers";


const LearnNew = () => {
  const { id } = useParams(); // courseId
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [limit, setLimit] = useState(10);
  const [step, setStep] = useState("loading"); // loading | select | learn | done | empty
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showKana, setShowKana] = useState(false);

  // ly t cha hc (lc bng progress)
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const snap = await getDocs(collection(db, "courses", id, "words"));
        const allWords = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const progressSnap = await getDocs(
          collection(db, "users", auth.currentUser.uid, "progress")
        );
        const progress = progressSnap.docs.map((d) => d.id);

        // lc t cha hc
        const newWords = allWords.filter((w) => !progress.includes(w.id));

        if (newWords.length === 0) {
          setStep("empty");
        } else {
          setWords(newWords);
          setStep("select");
        }
      } catch (err) {
        console.error("Li ti t mi:", err);
        setStep("empty");
      }
    };

    fetchWords();
  }, [id]);

  // to 4 la chn trc nghim
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

  // lu tin  v nh du  hc
  const saveProgress = async (word, isCorrect) => {
    const now = new Date();

    // 1 Lu vo progress ca user
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

    // 2 nh du t  hc trong subcollection words
    await updateDoc(doc(db, "courses", id, "words", word.id), {
      isLearned: true,
    });
  \n    try{ if (auth && auth.currentUser) { addScore(auth.currentUser.uid, auth.currentUser.displayName || auth.currentUser.email, 5); updateStreakOnActivity(auth.currentUser.uid); } }catch(e){}\n};

  const handleAnswer = async (choice) => {
    const word = words[currentIndex];
    const isCorrect = choice === word.meaning;

    setSelected(choice);
    setShowKana(true);
    speakWord(word);

    setFeedback(
      isCorrect
        ? " Chnh xc! Ht ging ang ny mm "
        : ` Sai ri. p n ng: ${word.meaning}`
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

  // Giao din
  if (step === "loading") {
    return <p style={{ textAlign: "center", marginTop: "50px" }}> ang ti...</p>;
  }

  if (step === "empty") {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2> Bn  hc ht tt c t trong kha ny ri!</h2>
        <button
          onClick={() => navigate(`/course/${id}`)}
          style={btnBack}
        >
          Quay v kha hc
        </button>
      </div>
    );
  }

  if (step === "select") {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>Chn s lng t  hc hm nay</h2>
        {[5, 10, 20].map((num) => (
          <button
            key={num}
            onClick={() => {
              setLimit(num);
              setStep("learn");
            }}
            style={btnSelect}
          >
            {num} t
          </button>
        ))}
      </div>
    );
  }

  if (step === "learn") {
    const word = words[currentIndex];
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>
          Hc t mi {currentIndex + 1}/{Math.min(limit, words.length)}
        </h2>

        <div style={wordBox}>
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
                ...btnOption,
                background:
                  selected === opt
                    ? opt === word.meaning
                      ? "#4CAF50"
                      : "#f44336"
                    : "#2196F3",
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

  if (step === "done") {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2> Hon thnh bui hc!</h2>
        <p>Bn  gieo ht thnh cng cho {Math.min(limit, words.length)} t mi </p>
        <button
          onClick={() => navigate(`/course/${id}`)}
          style={btnBack}
        >
          Quay v kha hc
        </button>
      </div>
    );
  }

  return null;
};

// styles
const btnBack = {
  marginTop: "20px",
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  background: "#2196F3",
  color: "#fff",
  cursor: "pointer",
};
const btnSelect = {
  margin: "10px",
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  background: "#2196F3",
  color: "#fff",
  cursor: "pointer",
};
const wordBox = {
  margin: "30px auto",
  padding: "40px",
  border: "2px solid #333",
  borderRadius: "10px",
  width: "300px",
  fontSize: "28px",
};
const btnOption = {
  display: "block",
  margin: "10px auto",
  padding: "10px 20px",
  width: "250px",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

export default LearnNew;
