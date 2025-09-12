// src/Home.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "./firebaseClient";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

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

  useEffect(() => {
    fetchCourses();
  }, []);

  // Xóa khóa học và toàn bộ từ trong subcollection
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) return;
    try {
      // Xóa toàn bộ words
      const wordsSnap = await getDocs(collection(db, "courses", courseId, "words"));
      const deletePromises = wordsSnap.docs.map((d) =>
        deleteDoc(doc(db, "courses", courseId, "words", d.id))
      );
      await Promise.all(deletePromises);

      // Xóa document khóa học
      await deleteDoc(doc(db, "courses", courseId));

      alert("✅ Đã xóa khóa học!");
      fetchCourses();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("❌ Xóa thất bại, vui lòng thử lại.");
    }
  };

  // Cập nhật tên khóa học
  const handleUpdateCourse = async (courseId) => {
    if (!newName.trim()) {
      alert("Tên khóa học không được để trống");
      return;
    }
    try {
      await updateDoc(doc(db, "courses", courseId), { title: newName });
      alert("✅ Đã cập nhật tên khóa học!");
      setEditingId(null);
      setNewName("");
      fetchCourses();
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("❌ Cập nhật thất bại, vui lòng thử lại.");
    }
  };

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
      <ul style={{ listStyle: "none", padding: 0 }}>
        {courses.length > 0 ? (
          courses.map((c) => (
            <li
              key={c.id}
              style={{
                marginBottom: "15px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {editingId === c.id ? (
                <>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ padding: "5px", marginRight: "10px" }}
                  />
                  <button
                    onClick={() => handleUpdateCourse(c.id)}
                    style={{ marginRight: "5px" }}
                  >
                    Lưu
                  </button>
                  <button onClick={() => setEditingId(null)}>Hủy</button>
                </>
              ) : (
                <>
                  <Link to={`/course/${c.id}`} style={{ textDecoration: "none" }}>
                    <strong>{c.title}</strong>
                  </Link>
                  <div>
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setNewName(c.title);
                      }}
                      style={{
                        marginLeft: "10px",
                        background: "#2196F3",
                        color: "white",
                        padding: "5px 8px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      style={{
                        marginLeft: "10px",
                        background: "red",
                        color: "white",
                        padding: "5px 8px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
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
