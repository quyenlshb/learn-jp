import React
import { addScore, updateStreakOnActivity } from "./firebaseHelpers";, { useState, useEffect } from "react";


const words = [
  { kanji: "", kana: "", romaji: "nichi", meaning: "ngy, mt tri" },
  { kanji: "", kana: "", romaji: "hon", meaning: "sch, Nht Bn" },
  { kanji: "", kana: "", romaji: "mizu", meaning: "nc" },
  { kanji: "", kana: "", romaji: "taberu", meaning: "n" },
  { kanji: "", kana: "", romaji: "iku", meaning: "i" }
];

function Learn({ onCorrect }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [mode, setMode] = useState("multiple"); // multiple | speed
  const [timeLeft, setTimeLeft] = useState(10);
  const [answer, setAnswer] = useState("");

  const currentWord = words[index];

  // X l cho ch  Speed Review
  useEffect(() => {
    if (mode === "speed" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (mode === "speed" && timeLeft === 0) {
      setFeedback(` Ht gi! Ngha ng: ${currentWord.meaning}`);
      nextWord();
    }
  }, [mode, timeLeft]);

  const nextWord = () => {
    setFeedback("");
    setAnswer("");
    setIndex((prev) => (prev + 1) % words.length);
    setTimeLeft(10);
  };

  // Kim tra cu tr li
  const checkAnswer = (ans) => {
    if (ans.trim().toLowerCase() === currentWord.meaning.toLowerCase()) {
      setFeedback(" Chnh xc!");
      onCorrect();
    } else {
      setFeedback(` Sai ri! Ngha ng: ${currentWord.meaning}`);
    }

    setTimeout(nextWord, 1500);
  };

  // To la chn cho Multiple Choice
  const getOptions = () => {
    let options = [currentWord.meaning];
    while (options.length < 4) {
      const rand = words[Math.floor(Math.random() * words.length)].meaning;
      if (!options.includes(rand)) options.push(rand);
    }
    return options.sort(() => Math.random() - 0.5);
  };

  return (
    <div style={{ marginTop: "20px", border: "1px solid gray", padding: "20px" }}>
      <h2>Hc t vng</h2>

      {/* Chn ch  */}
      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => setMode("multiple")}>Trc nghim</button>
        <button onClick={() => setMode("speed")}>Speed Review</button>
      </div>

      <p style={{ fontSize: "24px" }}>
        {currentWord.kanji} ({currentWord.kana}) [{currentWord.romaji}]
      </p>

      {/* Ch  trc nghim */}
      {mode === "multiple" && (
        <div>
          {getOptions().map((opt, i) => (
            <button
              key={i}
              onClick={() => checkAnswer(opt)}
              style={{ display: "block", margin: "5px 0", padding: "8px" }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Ch  Speed Review */}
      {mode === "speed" && (
        <div>
          <p> Thi gian cn li: {timeLeft} giy</p>
          <input
            type="text"
            placeholder="Nhp ngha nhanh..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ padding: "8px", width: "60%" }}
          />
          <button
            onClick={() => checkAnswer(answer)}
            style={{ marginLeft: "10px", padding: "8px 12px" }}
          >
            Xc nhn
          </button>
        </div>
      )}

      <p style={{ marginTop: "10px" }}>{feedback}</p>
    </div>
  );
}

export default Learn;
