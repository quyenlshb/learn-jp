// src/Leaderboard.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseClient";

const Leaderboard = ({ courseId = null }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const list = data.map((user) => {
          const score = courseId
            ? (user.perCourse?.[courseId] || 0) // điểm khóa cụ thể
            : (user.totalScore || 0);           // điểm tổng
          return { name: user.displayName || user.id, score };
        });

        const sorted = list
          .filter((u) => u.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // top 10

        setScores(sorted);
      } catch (err) {
        console.error("Lỗi tải BXH:", err);
      }
    };

    fetchLeaderboard();
  }, [courseId]);

  return (
    <aside
      style={{
        width: "250px",
        borderRight: "1px solid #ddd",
        padding: "15px",
        background: "#fafafa",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>
        🏆 {courseId ? "BXH khóa học" : "BXH tổng"}
      </h3>
      <ol style={{ paddingLeft: "20px" }}>
        {scores.length > 0 ? (
          scores.map((s, i) => (
            <div key={i} style={{ marginBottom: "8px" }} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
              👤 {s.name} - <b>{s.score}</b> điểm
            </div>
          ))
        ) : (
          <p>Chưa có dữ liệu</p>
        )}
      </ol>
    </aside>
  );
};

export default Leaderboard;
