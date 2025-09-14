// src/CourseDetail.js
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "./firebaseClient";
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");

  // Lấy thông tin khóa học
  const fetchCourse = async () => {
    const snap = await getDoc(doc(db, "courses", id));
    if (snap.exists()) {
      setCourse({ id: snap.id, ...snap.data() });
      setNewName(snap.data().name);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  // Xóa khóa học (bao gồm toàn bộ words)
  const handleDeleteCourse = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) return;
    try {
      // Xóa toàn bộ từ trong subcollection
      const wordsSnap = await getDocs(collection(db, "courses", id, "words"));
      const deletePromises = wordsSnap.docs.map((d) =>
        deleteDoc(doc(db, "courses", id, "words", d.id))
      );
      await Promise.all(deletePromises);

      // Xóa document khóa học
      await deleteDoc(doc(db, "courses", id));

      alert("✅ Đã xóa khóa học!");
      navigate("/home");
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("❌ Xóa thất bại, vui lòng thử lại.");
    }
  };

  // Cập nhật tên khóa học
  const handleUpdateCourse = async () => {
    if (!newName.trim()) {
      alert("Tên khóa học không được để trống");
      return;
    }
    try {
      await updateDoc(doc(db, "courses", id), { name: newName });
      alert("✅ Đã cập nhật tên khóa học!");
      setEditMode(false);
      fetchCourse();
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("❌ Cập nhật thất bại, vui lòng thử lại.");
    }
  };

  if (!course) return <p>Đang tải...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chi tiết khóa học</h2>

      {editMode ? (
        <div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ padding: "6px", marginRight: "10px" }}
          />
          <button onClick={handleUpdateCourse} style={{ marginRight: "5px" }}>
            Lưu
          </button>
          <button onClick={() => setEditMode(false)}>Hủy</button>
        </div>
      ) : (
        <h3>
          {course.name}{" "}
          <button onClick={() => setEditMode(true)} style={{ marginLeft: "10px" }}>
            ✏️ Sửa
          </button>
        </h3>
      )}

      <div style={{ margin: "20px 0" }}>
        <Link to={`/course/${id}/view`}>
          <button style={{ marginRight: "10px" }}>📖 Xem từ vựng</button>
        </Link>
        <Link to={`/learn-new/${id}`}>
          <button style={{ marginRight: "10px" }}>🆕 Học từ mới</button>
        </Link>
        <Link to={`/review/${id}`}>
          <button style={{ marginRight: "10px" }}>🔄 Ôn tập</button>
        </Link>
        <Link to={`/difficult/${id}`}>
          <button style={{ marginRight: "10px" }}>⚡ Ôn từ khó</button>
        </Link>
        <Link to={`/speed-review/${id}`}>
          <button>⏱️ Ôn tập nhanh</button>
        </Link>
      </div>

      <button
        onClick={handleDeleteCourse}
        style={{
          background: "red",
          color: "white",
          padding: "8px 12px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        🗑️ Xóa khóa học
      </button>
    </div>
  );
}

export default CourseDetail;
