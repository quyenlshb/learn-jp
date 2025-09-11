// src/CreateCourse.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebaseClient";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [wordList, setWordList] = useState(""); // danh sách từ copy–paste
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      // Tạo khoá học
      const courseRef = await addDoc(collection(db, "courses"), {
        title: title.trim(),
        owner: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      // Xử lý danh sách từ
      if (wordList.trim()) {
        const lines = wordList.trim().split("\n");
        for (let line of lines) {
          const parts = line.trim().split(/\s{2,}|\t/); 
          // tách theo tab hoặc >=2 khoảng trắng
          if (parts.length >= 3) {
            const [kanji, kana, meaning] = parts;
            await addDoc(collection(db, "words"), {
              courseId: courseRef.id,
              kanji: kanji.trim(),
              kana: kana.trim(),
              meaning: meaning.trim(),
              createdAt: serverTimestamp(),
            });
          }
        }
      }

      // Quay lại Trang chủ
      navigate("/home");
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Không tạo được khoá học, thử lại!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tạo khoá học mới</h2>
      <form onSubmit={handleSubmit}>
        {/* Tên khoá học */}
        <div style={{ marginBottom: "15px" }}>
          <label>Tên khoá học:</label>
          <br />
          <input
            type="text"
            placeholder="vd: JLPT N5"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "10px", width: "300px" }}
          />
        </div>

        {/* Danh sách từ */}
        <div style={{ marginBottom: "15px" }}>
          <label>Danh sách từ (mỗi dòng: Kanji  Kana  Nghĩa):</label>
          <br />
          <textarea
            placeholder={`Ví dụ:\n日  にち  ngày\n月  つき  mặt trăng`}
            value={wordList}
            onChange={(e) => setWordList(e.target.value)}
            rows="10"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Lưu khoá học
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
