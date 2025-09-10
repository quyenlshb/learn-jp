import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseClient";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Learn from "./Learn"; // 👈 thêm phần học từ vựng

function Dashboard() {
  const [user] = useAuthState(auth);
  const [score, setScore] = useState(0);

  // Lấy điểm từ Firestore khi login
  useEffect(() => {
    if (user) {
      const loadScore = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setScore(docSnap.data().score || 0);
        }
      };
      loadScore();
    }
  }, [user]);

  // Hàm cộng điểm khi học đúng
  const addPoint = async () => {
    if (!user) return;
    const newScore = score + 1;
    setScore(newScore);
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, { score: newScore });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Xin chào {user?.email}</h1>
      <p>Điểm của bạn: {score}</p>

      {/* Phần học từ vựng */}
      <Learn onCorrect={addPoint} />
    </div>
  );
}

export default Dashboard;
