import React, { useState, useEffect } from "react";

const words = [
  { kanji: "日", kana: "にち", romaji: "nichi", meaning: "ngày, mặt trời" },
  { kanji: "本", kana: "ほん", romaji: "hon", meaning: "sách, Nhật Bản" },
  { kanji: "水", kana: "みず", romaji: "mizu", meaning: "nước" },
  { kanji: "食べる", kana: "たべる", romaji: "taberu", meaning: "ăn" },
  { kanji: "行く", kana: "いく", romaji: "iku", meaning: "đi" }
];

function Learn({ onCorrect }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [mode, setMode] = useState("multiple"); // multiple | speed
  const [timeLeft, setTimeLeft] = useState(10);
  const [answer, setAnswer] = useState("");

  const currentWord = words[index];

  // Xử lý cho chế độ Speed Review
  useEffect(() => {
    if (mode === "speed" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (mode === "speed" && timeLeft === 0) {
      setFeedback(`⏰ Hết giờ! Nghĩa đúng: ${currentWord.meaning}`);
      nextWord();
    }
  }, [mode, timeLeft]);

  const nextWord = () => {
    setFeedback("");
    setAnswer("");
    setIndex((prev) => (prev + 1) % words.length);
    setTimeLeft(10);
  };

  // Kiểm tra câu trả lời
  const checkAnswer = (ans) => {
    if (ans.trim().toLowerCase() === currentWord.meaning.toLowerCase()) {
      setFeedback("✅ Chính xác!");
      onCorrect();
    } else {
      setFeedback(`❌ Sai rồi! Nghĩa đúng: ${currentWord.meaning}`);
    }

    setTimeout(nextWord, 1500);
  };

  // Tạo lựa chọn cho Multiple Choice
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
      <h2>Học từ vựng</h2>

      {/* Chọn chế độ */}
      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => setMode("multiple")}>Trắc nghiệm</button>
        <button onClick={() => setMode("speed")}>Speed Review</button>
      </div>

      <p style={{ fontSize: "24px" }}>
        {currentWord.kanji} ({currentWord.kana}) [{currentWord.romaji}]
      </p>

      {/* Chế độ trắc nghiệm */}
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

      {/* Chế độ Speed Review */}
      {mode === "speed" && (
        <div>
          <p>⏳ Thời gian còn lại: {timeLeft} giây</p>
          <input
            type="text"
            placeholder="Nhập nghĩa nhanh..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ padding: "8px", width: "60%" }}
          />
          <button
            onClick={() => checkAnswer(answer)}
            style={{ marginLeft: "10px", padding: "8px 12px" }}
          >
            Xác nhận
          </button>
        </div>
      )}

      <p style={{ marginTop: "10px" }}>{feedback}</p>
    </div>
  );
}

export default Learn;
