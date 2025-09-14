// src/Explore.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "./firebaseClient";

const Explore = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchPublicCourses = async () => {
      try {
        const q = query(collection(db, "courses"), where("isPublic", "==", true));
        const snap = await getDocs(q);
        const list = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((c) => c.owner !== auth.currentUser?.uid); // b kha hc ca chnh mnh
        setCourses(list);
      } catch (err) {
        console.error("Li ly kha hc cng khai:", err);
      }
    };

    fetchPublicCourses();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2> Khm ph kha hc cng khai</h2>
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
              }}
            >
              <Link to={`/course/${c.id}`} style={{ textDecoration: "none", fontSize: "18px" }}>
                <strong>{c.title || c.name}</strong>
              </Link>
              <p style={{ margin: "5px 0" }}> Ngi to: {c.ownerName || "n danh"}</p>
            </li>
          ))
        ) : (
          <p>Khng c kha hc cng khai no.</p>
        )}
      </ul>
    </div>
  );
};

export default Explore;
