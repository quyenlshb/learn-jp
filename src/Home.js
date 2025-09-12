// src/Home.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "./firebaseClient";

const Home = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [publicCourses, setPublicCourses] = useState([]);
  const [learningCourses, setLearningCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  // Lấy khóa học
  const fetchCourses = async () => {
    try {
      const snapshot = await getDocs(collection(db, "courses"));
      const allCourses = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      const mine = allCourses.filter(
        (c) => c.owner === auth.currentUser?.uid
      );
      const publics = allCourses.filter(
        (c) => c.isPublic && c.owner !== auth.currentUser?.uid
      );

      setMyCourses(mine);
      setPublicCourses(publics);

      // lấy khóa học đang học từ progress
      if (auth.currentUser) {
        const progressSnap = await getDocs(
          collection(db, "users", auth.currentUser.uid, "progress")
        );
        const progress = progressSnap.docs.map((d) => d.data().courseId);
        const uniqueCourseIds = [...new Set(progress)];
        const learning = allCourses.filter((c) =>
          uniqueCourseIds.includes(c.id)
        );
        setLearningCourses(learning);
      }
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
      const wordsSnap = await getDocs(
        collection(db, "courses", courseId, "words")
      );
      const deletePromises = wordsSnap.docs.map((d) =>
        deleteDoc(doc(db, "courses", courseId, "words", d.id))
      );
      await Promise.all(deletePromises);

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

  // render list course
  const renderCourseList = (courses, allowEdit = false) => (
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
            {allowEdit && editingId === c.id ? (
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
                <div>
                  <Link
                    to={`/course/${c.id}`}
                    style={{ textDecoration: "none", fontWeight: "bold" }}
                  >
                    {c.title}
                  </Link>
                  {!allowEdit && (
                    <p style={{ margin: "5px 0", color: "#666" }}>
                      👤 Người tạo: {c.owner}
                    </p>
                  )}
                </div>
                {allowEdit && (
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
                )}
              </>
            )}
          </li>
        ))
      ) : (
        <p>Không có khoá học nào.</p>
      )}
    </ul>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>🏠 Trang chủ</h1>

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
        <Link
          to="/create-course"
          style={{ color: "white", textDecoration: "none" }}
        >
          ➕ Tạo khoá học
        </Link>
      </button>

      {/* Khóa học đang học */}
      <h3>📖 Khóa học đang học</h3>
      {renderCourseList(learningCourses, false)}

      {/* Khóa học của tôi */}
      <h3>📘 Khóa học do tôi tạo</h3>
      {renderCourseList(myCourses, true)}

      {/* Khóa học công khai */}
      <h3>🌍 Khóa học được chia sẻ từ cộng đồng</h3>
      {renderCourseList(publicCourses, false)}
    </div>
  );
};

export default Home;
