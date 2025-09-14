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
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  const fetchCourses = async () => {
    try {
      const snapshot = await getDocs(collection(db, "courses"));
      const allCourses = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // Tách ra khóa học của tôi & khóa học công khai
      const mine = allCourses.filter(
        (c) => c.owner === auth.currentUser?.uid
      );
      const publics = allCourses.filter(
        (c) => c.isPublic && c.owner !== auth.currentUser?.uid
      );

      setMyCourses(mine);
      setPublicCourses(publics);
    } catch (err) {
      console.error("Lỗi lấy danh sách khoá học:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Xóa khóa học
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "courses", id));
      fetchCourses();
    } catch (err) {
      console.error("Lỗi xoá khoá học:", err);
    }
  };

  // Sửa tên khóa học
  const handleEdit = async (id) => {
    try {
      await updateDoc(doc(db, "courses", id), { title: newName });
      setEditingId(null);
      setNewName("");
      fetchCourses();
    } catch (err) {
      console.error("Lỗi sửa khoá học:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Trang chủ</h1>

      <h2>Khoá học của tôi</h2>
      <ul>
        {myCourses.map((course) => (
          <li key={course.id}>
            {editingId === course.id ? (
              <>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={() => handleEdit(course.id)}>Lưu</button>
                <button onClick={() => setEditingId(null)}>Huỷ</button>
              </>
            ) : (
              <>
                <Link to={`/course/${course.id}`}>{course.title}</Link>
                <button onClick={() => handleDelete(course.id)}>Xoá</button>
                <button
                  onClick={() => {
                    setEditingId(course.id);
                    setNewName(course.title);
                  }}
                >
                  Sửa
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2>Khoá học công khai</h2>
      <ul>
        {publicCourses.map((course) => (
          <li key={course.id}>
            <Link to={`/course/${course.id}`}>{course.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
