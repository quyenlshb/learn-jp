// src/CourseDetail.js
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "./firebaseClient";
import { addScore, updateStreakOnActivity } from "./firebaseHelpers";

import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");

  // Ly thng tin kha hc
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

  // Xa kha hc (bao gm ton b words)
  const handleDeleteCourse = async () => {
    if (!window.confirm("Bn c chc chn mun xa kha hc ny khng?")) return;
    try {
      // Xa ton b t trong subcollection
      const wordsSnap = await getDocs(collection(db, "courses", id, "words"));
      const deletePromises = wordsSnap.docs.map((d) =>
        deleteDoc(doc(db, "courses", id, "words", d.id))
      );
      await Promise.all(deletePromises);

      // Xa document kha hc
      await deleteDoc(doc(db, "courses", id));

      alert("  xa kha hc!");
      navigate("/home");
    } catch (err) {
      console.error("Li khi xa:", err);
      alert(" Xa tht bi, vui lng th li.");
    }
  };

  // Cp nht tn kha hc
  const handleUpdateCourse = async () => {
    if (!newName.trim()) {
      alert("Tn kha hc khng c  trng");
      return;
    }
    try {
      await updateDoc(doc(db, "courses", id), { name: newName });
      alert("  cp nht tn kha hc!");
      setEditMode(false);
      fetchCourse();
    } catch (err) {
      console.error("Li khi cp nht:", err);
      alert(" Cp nht tht bi, vui lng th li.");
    }
  };

  if (!course) return <p>ang ti...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chi tit kha hc</h2>

      {editMode ? (
        <div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ padding: "6px", marginRight: "10px" }}
          />
          <button onClick={handleUpdateCourse} style={{ marginRight: "5px" }}>
            Lu
          </button>
          <button onClick={() => setEditMode(false)}>Hy</button>
        </div>
      ) : (
        <h3>
          {course.name}{" "}
          <button onClick={() => setEditMode(true)} style={{ marginLeft: "10px" }}>
             Sa
          </button>
        </h3>
      )}

      <div style={{ margin: "20px 0" }}>
        <Link to={`/course/${id}/view`}>
          <button style={{ marginRight: "10px" }}> Xem t vng</button>
        </Link>
        <Link to={`/learn-new/${id}`}>
          <button style={{ marginRight: "10px" }}> Hc t mi</button>
        </Link>
        <Link to={`/review/${id}`}>
          <button style={{ marginRight: "10px" }}> n tp</button>
        </Link>
        <Link to={`/difficult/${id}`}>
          <button style={{ marginRight: "10px" }}> n t kh</button>
        </Link>
        <Link to={`/speed-review/${id}`}>
          <button> n tp nhanh</button>
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
         Xa kha hc
      </button>
    </div>
  );
}

export default CourseDetail;
