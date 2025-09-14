// src/LeaderboardCourse.js
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./firebaseClient";

const LeaderboardCourse = ({ courseIds = [], timeframe = "total" }) => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const merged = {};
      for (const cid of courseIds) {
        const ref = collection(db, "courses", cid, "scores");
        const q = query(ref, orderBy(`points${timeframe[0].toUpperCase()}${timeframe.slice(1)}`, "desc"), limit(20));
        const snap = await getDocs(q);
        snap.docs.forEach(doc => {
          const d = doc.data();
          if (!merged[doc.id]) {
            merged[doc.id] = { uid: doc.id, displayName: d.displayName, avatarUrl: d.avatarUrl, points: 0 };
          }
          const val = d[`points${timeframe[0].toUpperCase()}${timeframe.slice(1)}`] || 0;
          merged[doc.id].points += val;
        });
      }
      const arr = Object.values(merged).sort((a,b)=>b.points-a.points).slice(0,20);
      setLeaders(arr);
    };
    fetchData();
  }, [courseIds, timeframe]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Course Leaderboard ({timeframe})</h2>
      <table className="table-auto w-full">
        <thead>
          <tr><th className="px-2 py-1">#</th><th className="px-2 py-1">Name</th><th className="px-2 py-1">Points</th></tr>
        </thead>
        <tbody>
          {leaders.map((u,idx)=>(
            <tr key={u.uid} className="border-t">
              <td className="px-2 py-1">{idx+1}</td>
              <td className="px-2 py-1 flex items-center gap-2">
                {u.avatarUrl && <img src={u.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full" />}
                {u.displayName || u.uid}
              </td>
              <td className="px-2 py-1">{u.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardCourse;
