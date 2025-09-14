import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseClient";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Learn from "./Learn"; //  thm phn hc t vng

function Dashboard() {
  const [user] = useAuthState(auth);
  const [score, setScore] = useState(0);

  // Ly im t Firestore khi login
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

  // Hm cng im khi hc ng
  const addPoint = async () => {
    if (!user) return;
    const newScore = score + 1;
    setScore(newScore);
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, { score: newScore });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Xin cho {user?.email}</h1>
      <p>im ca bn: {score}</p>

      {/* Phn hc t vng */}
      <Learn onCorrect={addPoint} />
    </div>
  );
}

export default Dashboard;
