// src/Home.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "./firebaseClient";

const Home = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(
          collection(db, "courses"),
          where("owner", "==", auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(list);
      } catch (err) {
        console.error("Lỗi lấy danh sách khoá học:", err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Trang chủ</h2>

      <button
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        <Link to="/create-course" style={{ color: "white", textDecoration: "none" }}>
          ➕ Tạo khoá học
        </Link>
      </button>

      <h3>Danh sách khoá học</h3>
      <ul>
  {courses.length > 0 ? (
    courses.map((c) => (
      <li key={c.id}>
        <Link to={`/course/${c.id}`}>{c.title}</Link>
      </li>
    ))
  ) : (
    <p>Chưa có khoá học nào.</p>
  )}
</ul>
    </div>
  );
};

export default Home;
