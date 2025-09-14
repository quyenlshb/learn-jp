// src/Home.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebaseClient";

const Home = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [publicCourses, setPublicCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const snapshot = await getDocs(collection(db, "courses"));
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const mine = all.filter((c) => c.owner === (auth.currentUser && auth.currentUser.email));
      const pub = all.filter((c) => c.isPublic);
      setMyCourses(mine);
      setPublicCourses(pub);
    } catch (err) {
      console.error("Lỗi khi lấy khóa học:", err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) return;
    try {
      await deleteDoc(doc(db, "courses", courseId));
      fetchCourses();
      alert("Đã xóa khóa học.");
    } catch (err) {
      console.error("Lỗi xóa:", err);
      alert("Xóa thất bại.");
    }
  };

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-4">📘 Khoá học của tôi</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {myCourses.length === 0 ? (
            <li>Chưa có khóa học.</li>
          ) : (
            myCourses.map((c) => (
              <li key={c.id} style={{ marginBottom: 12 }}>
                <Link to={`/course/${c.id}`} style={{ textDecoration: "none", fontWeight: "600" }}>
                  {c.title}
                </Link>{" "}
                <button onClick={() => handleDeleteCourse(c.id)} style={{ marginLeft: 8 }}>
                  Xóa
                </button>
              </li>
            ))
          )}
        </ul>

        <h2 className="text-2xl font-bold my-4">🌍 Khoá học công khai</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {publicCourses.length === 0 ? (
            <li>Không có khoá học công khai.</li>
          ) : (
            publicCourses.map((c) => (
              <li key={c.id} style={{ marginBottom: 12 }}>
                <Link to={`/course/${c.id}`} style={{ textDecoration: "none", fontWeight: "600" }}>
                  {c.title}
                </Link>{" "}
                <span style={{ color: "#666", marginLeft: 8 }}>👤 {c.owner}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
};

export default Home;
