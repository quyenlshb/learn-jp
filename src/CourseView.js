// src/CourseView.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebaseClient";
import LeaderboardCourse from "./LeaderboardCourse"; // 👉 thêm import

const CourseView = () => {
  const { id } = useParams(); // id khoá học
  const [words, setWords] = useState([]);
  const [learnedCount, setLearnedCount] = useState(0);
  const [editWordId, setEditWordId] = useState(null);
  const [editData, setEditData] = useState({ kanji: "", kana: "", meaning: "" });
  const [course, setCourse] = useState(null);

  const fetchWords = async () => {
    try {
      const q = collection(db, "courses", id, "words");
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setWords(list);

      const learned = list.filter((w) => w.isLearned).length;
      setLearnedCount(learned);
    } catch (error) {
      console.error("Lỗi tải từ vựng:", error);
    }
  };

  const fetchCourseInfo = async () => {
    try {
      const snap = await getDoc(doc(db, "courses", id));
      if (snap.exists()) {
        setCourse({ id: snap.id, ...snap.data() });
      }
    } catch (error) {
      console.error("Lỗi tải thông tin khóa học:", error);
    }
  };

  useEffect(() => {
    fetchWords();
    fetchCourseInfo();
  }, [id]);

  const total = words.length;
  const progress = total > 0 ? Math.round((learnedCount / total) * 100) : 0;

  const handleDeleteWord = async (wordId) => {
    if (!window.confirm("Bạn có chắc muốn xóa từ này không?")) return;
    await deleteDoc(doc(db, "courses", id, "words", wordId));
    fetchWords();
  };

  const handleStartEdit = (word) => {
    setEditWordId(word.id);
    setEditData({
      kanji: word.kanji || "",
      kana: word.kana || "",
      meaning: word.meaning || "",
    });
  };

  const handleSaveEdit = async () => {
    await updateDoc(doc(db, "courses", id, "words", editWordId), {
      kanji: editData.kanji,
      kana: editData.kana,
      meaning: editData.meaning,
    });
    setEditWordId(null);
    fetchWords();
  };

  const togglePublic = async () => {
    try {
      await updateDoc(doc(db, "courses", id), {
        isPublic: !course.isPublic,
      });
      alert(
        course.isPublic
          ? "🔒 Khóa học đã được đặt về riêng tư"
          : "🌍 Khóa học đã được công khai!"
      );
      fetchCourseInfo();
    } catch (err) {
      console.error("Lỗi toggle công khai:", err);
      alert("❌ Không thể thay đổi trạng thái công khai");
    }
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* BXH bên trái */}
      <LeaderboardCourse courseId={id} />

      {/* Nội dung chính */}
      <div style={{ flex: 1 }}>
        <h2>Khoá học</h2>

        {course && (
          <button
            onClick={togglePublic}
            style={{
              marginBottom: "20px",
              background: course.isPublic ? "#f44336" : "#4CAF50",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {course.isPublic ? "🔒 Đặt riêng tư" : "🌍 Công khai"}
          </button>
        )}

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
                <th style={thStyle}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {words.map((w) => (
                <tr key={w.id}>
                  {editWordId === w.id ? (
                    <>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={editData.kanji}
                          onChange={(e) =>
                            setEditData({ ...editData, kanji: e.target.value })
                          }
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={editData.kana}
                          onChange={(e) =>
                            setEditData({ ...editData, kana: e.target.value })
                          }
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={editData.meaning}
                          onChange={(e) =>
                            setEditData({ ...editData, meaning: e.target.value })
                          }
                        />
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={handleSaveEdit}
                          style={{ marginRight: "5px" }}
                        >
                          Lưu
                        </button>
                        <button onClick={() => setEditWordId(null)}>Hủy</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={tdStyle}>{w.kanji || "-"}</td>
                      <td style={tdStyle}>{w.kana}</td>
                      <td style={tdStyle}>{w.meaning}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleStartEdit(w)}
                          style={{ marginRight: "5px" }}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteWord(w.id)}
                          style={{ background: "red", color: "white" }}
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa có từ nào trong khoá học.</p>
        )}
      </div>
    </div>
  );
};

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
