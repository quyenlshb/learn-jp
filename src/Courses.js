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
        // Ly danh sch courses t Firestore (collection "courses")
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
    <div style={{ padding: "20px" }}>
      <h2>Chn kho hc</h2>
      <ul>
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                margin: "10px 0",
                cursor: "pointer",
              }}
              onClick={() = className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col"> navigate(`/learn/${course.id}`)}
            >
              {course.title || "Kho hc khng tn"}
            </div>
          ))
        ) : (
          <p>Cha c kho hc no.</p>
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
         To b t mi
      </button>
    </div>
  );
};

export default Courses;
