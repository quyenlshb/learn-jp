// src/Courses.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseClient";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Lấy danh sách courses từ Firestore (collection "courses")
        const querySnapshot = await getDocs(collection(db, "courses"));
        const courseList = [];
        querySnapshot.forEach((doc) => {
          courseList.push({ id: doc.id, ...doc.data() });
        });
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-50 min-h-screen" style={{ padding: "20px" }}>
      <h2>Chọn khoá học</h2>
      <ul>
        {courses.length > 0 ? (
          courses.map((course) => (
            <li
              key={course.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                margin: "10px 0",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/learn/${course.id}`)}
            >
              {course.title || "Khoá học không tên"}
            </li>
          ))
        ) : (
          <p>Chưa có khoá học nào.</p>
        )}
      </ul>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/create-course")}
      >
        ➕ Tạo bộ từ mới
      </button>
    </div>
  );
};

export default Courses;
