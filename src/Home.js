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
import Leaderboard from "./Leaderboard"; //  thm BXH

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

      // Tch ra kha hc ca ti & kha hc cng khai
      const mine = allCourses.filter(
        (c) => c.owner === auth.currentUser?.uid
      );
      const publics = allCourses.filter(
        (c) => c.isPublic && c.owner !== auth.currentUser?.uid
      );

      setMyCourses(mine);
      setPublicCourses(publics);
    } catch (err) {
      console.error("Li ly danh sch kho hc:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Xa kha hc v ton b t trong subcollection
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Bn c chc chn mun xa kha hc ny khng?")) return;
    try {
      // Xa ton b words trong subcollection
      const wordsSnap = await getDocs(collection(db, "courses", courseId, "words"));
      const deletePromises = wordsSnap.docs.map((d) =>
        deleteDoc(doc(db, "courses", courseId, "words", d.id))
      );
      await Promise.all(deletePromises);

      // Xa document kha hc
      await deleteDoc(doc(db, "courses", courseId));

      alert("  xa kha hc!");
      fetchCourses();
    } catch (err) {
      console.error("Li khi xa:", err);
      alert(" Xa tht bi, vui lng th li.");
    }
  };

  // Cp nht tn kha hc
  const handleUpdateCourse = async (courseId) => {
    if (!newName.trim()) {
      alert("Tn kha hc khng c  trng");
      return;
    }
    try {
      await updateDoc(doc(db, "courses", courseId), { title: newName });
      alert("  cp nht tn kha hc!");
      setEditingId(null);
      setNewName("");
      fetchCourses();
    } catch (err) {
      console.error("Li khi cp nht:", err);
      alert(" Cp nht tht bi, vui lng th li.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ display: "flex" }}>
      {/* BXH tng bn tri */}
      

      {/* Ni dung chnh */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}> Trang ch</h1>

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
             To kho hc
          </Link>
        </button>

        {/* Kho hc ca ti */}
        <h3> Kho hc ca ti</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {myCourses.length > 0 ? (
            myCourses.map((c) => (
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
                      Lu
                    </button>
                    <button onClick={() => setEditingId(null)}>Hy</button>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/course/${c.id}`}
                      style={{ textDecoration: "none" }}
                    >
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
                        
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <p>Cha c kho hc no.</p>
          )}
        </ul>

        {/* Kho hc cng khai */}
        <h3> Kho hc c chia s t cng ng</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {publicCourses.length > 0 ? (
            publicCourses.map((c) => (
              <li
                key={c.id}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <Link to={`/course/${c.id}`} style={{ textDecoration: "none" }}>
                  <strong>{c.title}</strong>
                </Link>
                <p style={{ margin: "5px 0", color: "#666" }}>
                   Ngi to: {c.owner}
                </p>
              </li>
            ))
          ) : (
            <p>Khng c kho hc cng khai no.</p>
          )}
        </ul>
      </div>
    </div>
      </div>
    </main>
  );
};

export default Home;
