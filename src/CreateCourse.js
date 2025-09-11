// src/CreateCourse.js
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "./firebaseClient";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [rawWords, setRawWords] = useState(""); // nhập list từ
  const navigate = useNavigate();

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("⚠️ Vui lòng nhập tên khóa học");
      return;
    }

    try {
      // tạo document khóa học trong Firestore
      const courseRef = await addDoc(collection(db, "courses"), {
        title,
        owner: auth.currentUser.uid,
        createdAt: new Date(),
      });

      const courseId = courseRef.id;

      // tách list từ trong textarea
      const lines = rawWords.split("\n").map((l) => l.trim()).filter(Boolean);

      for (const line of lines) {
        // Format: Kanji Kana Nghĩa
        const parts = line.split(/\s+/);
        if (parts.length >= 3) {
          const kanji = parts[0];
          const kana = parts[1];
          const meaning = parts.slice(2).join(" ");

          await addDoc(collection(db, "courses", courseId, "words"), {
            kanji,
            kana,
            meaning,
          });
        }
      }

      alert("✅ Tạo khóa học thành công!");
      navigate("/home");
    } catch (err) {
      console.error("Lỗi tạo khóa học:", err);
      alert("❌ Có lỗi xảy ra khi tạo khóa học.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Tạo khóa học mới</h2>
      <form onSubmit={handleCreateCourse}>
        <div style={{ marginBottom: "20px" }}>
          <label>Tên khóa học:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>
            Danh sách từ (mỗi dòng: <b>Kanji Kana Nghĩa</b>):
          </label>
          <textarea
            rows="10"
            value={rawWords}
            onChange={(e) => setRawWords(e.target.value)}
            placeholder={`犬 いぬ Chó\n猫 ねこ Mèo\n日本 にほん Nhật Bản`}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontFamily: "monospace",
            }}
          ></textarea>
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Tạo khóa học
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
