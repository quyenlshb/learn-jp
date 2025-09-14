// src/LeaderboardCourse.js
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./firebaseClient";

const LeaderboardCourse = ({ courseId }) => {
  const [leaders, setLeaders] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      const q = query(
        collection(db, "courses", courseId, "scores"), // subcollection lưu điểm
        orderBy("points", "desc"),
        limit(10)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLeaders(list);
    } catch (err) {
      console.error("Lỗi lấy BXH:", err);
    }
  };

  useEffect(() => {
    if (courseId) fetchLeaderboard();
  }, [courseId]);

  return (
    <div
      style={{
        width: "250px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        marginRight: "20px",
        background: "#fafafa",
      }}
    >
      <h3 style={{ marginTop: 0 }}>🏆 BXH khóa học</h3>
      {leaders.length > 0 ? (
        <div className="space-y-3">{
  leaders.map((u, i) => (
            <div key={u.id} style={{ marginBottom: "8px" }} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
              <strong>
                {i + 1}. {u.username || u.id}
              </strong>{" "}
              - {u.points} điểm
            </div>
          ))}
        </div>
      ) : (
        <p>Chưa có ai trong BXH.</p>
      )}
    </div>
  );
};

export default LeaderboardCourse;
