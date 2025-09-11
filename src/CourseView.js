// src/CourseView.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseClient";

const CourseView = () => {
  const { id } = useParams(); // id khoá học
  const [words, setWords] = useState([]);
  const [learnedCount, setLearnedCount] = useState(0);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const q = query(collection(db, "words"), where("courseId", "==", id));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setWords(list);

        // ⚠️ Sau này sẽ thay bằng dữ liệu thực tế user progress
        setLearnedCount(0);
      } catch (error) {
        console.error("Lỗi tải từ vựng:", error);
      }
    };

    fetchWords();
  }, [id]);

  const total = words.length;
  const progress = total > 0 ? Math.round((learnedCount / total) * 100) : 0;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Khoá học</h2>

      {/* Thanh tiến độ */}
      <div style={{ margin: "20px 0" }}>
        <div
          style={{
            background: "#ddd",
            borderRadius: "10px",
            overflow: "hidden",
            height: "20px",
            width: "100%",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              background: "#4CAF50",
              height: "100%",
              textAlign: "center",
              color: "white",
              fontSize: "12px",
            }}
          >
            {progress}%
          </div>
        </div>
        <p>
          {learnedCount} / {total} từ đã học
        </p>
      </div>

      {/* Các lựa chọn */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <Link to={`/learn-new/${id}`} style={btnStyle("#2196F3")}>
          📘 Học từ mới
        </Link>
        <Link to={`/review/${id}`} style={btnStyle("#4CAF50")}>
          📖 Ôn tập từ đã học
        </Link>
        <Link to={`/difficult/${id}`} style={btnStyle("#FF9800")}>
          ❗ Ôn tập từ sai nhiều
        </Link>
        <Link to={`/speed-review/${id}`} style={btnStyle("#9C27B0")}>
          ⚡ Ôn tập nhanh
        </Link>
      </div>

      {/* Danh sách từ vựng */}
      <h3>Danh sách từ vựng</h3>
      {words.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th style={thStyle}>Kanji</th>
              <th style={thStyle}>Kana</th>
              <th style={thStyle}>Nghĩa</th>
            </tr>
          </thead>
          <tbody>
            {words.map((w) => (
              <tr key={w.id}>
                <td style={tdStyle}>{w.kanji || "-"}</td>
                <td style={tdStyle}>{w.kana}</td>
                <td style={tdStyle}>{w.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Chưa có từ nào trong khoá học.</p>
      )}
    </div>
  );
};

// helper style
const btnStyle = (color) => ({
  textAlign: "center",
  padding: "15px",
  background: color,
  color: "#fff",
  textDecoration: "none",
  borderRadius: "8px",
});

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

export default CourseView;
