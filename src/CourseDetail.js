// src/CourseDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseClient";

const CourseDetail = () => {
  const { id } = useParams(); // id khoá học
  const [words, setWords] = useState([]);
  const [kanji, setKanji] = useState("");
  const [kana, setKana] = useState("");
  const [meaning, setMeaning] = useState("");
  const [romaji, setRomaji] = useState("");

  // Lấy danh sách từ vựng của khoá học
  const fetchWords = async () => {
    try {
      const q = query(collection(db, "words"), where("courseId", "==", id));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWords(list);
    } catch (error) {
      console.error("Lỗi lấy từ vựng:", error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [id]);

  // Thêm từ mới
  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!kanji && !kana) return;

    try {
      await addDoc(collection(db, "words"), {
        courseId: id,
        kanji,
        kana,
        meaning,
        romaji,
        createdAt: serverTimestamp(),
      });

      // Reset form
      setKanji("");
      setKana("");
      setMeaning("");
      setRomaji("");

      // Load lại danh sách
      fetchWords();
    } catch (error) {
      console.error("Lỗi thêm từ:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chi tiết khoá học</h2>

      {/* Form thêm từ mới */}
      <form onSubmit={handleAddWord} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Kanji"
          value={kanji}
          onChange={(e) => setKanji(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="Kana"
          value={kana}
          onChange={(e) => setKana(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="Romaji"
          value={romaji}
          onChange={(e) => setRomaji(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="Nghĩa tiếng Việt"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button
          type="submit"
          style={{
            padding: "6px 12px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          ➕ Thêm từ
        </button>
      </form>

      {/* Danh sách từ vựng */}
      <h3>Danh sách từ</h3>
      {words.length > 0 ? (
        <ul>
          {words.map((w) => (
            <li key={w.id}>
              <strong>{w.kanji || w.kana}</strong> ({w.kana}) [{w.romaji}] →{" "}
              {w.meaning}
            </li>
          ))}
        </ul>
      ) : (
        <p>Chưa có từ nào.</p>
      )}
    </div>
  );
};

export default CourseDetail;
