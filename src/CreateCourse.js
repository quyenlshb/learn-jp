// src/CreateCourse.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebaseClient";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await addDoc(collection(db, "courses"), {
        title: title.trim(),
        owner: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      navigate("/home"); // quay lại trang chủ
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Không tạo được khoá học, thử lại!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tạo khoá học mới</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên khoá học (vd: JLPT N5)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "10px", width: "300px" }}
        />
        <br />
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
          Lưu
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
