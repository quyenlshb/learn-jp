import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebaseClient";

const LeaderboardCourse = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, "courseLeaderboard"), orderBy("score", "desc"));
        const snap = await getDocs(q);
        setRows(snap.docs.map((d,i) => ({ id: d.id, rank: i+1, ...d.data() })));
      } catch (e) { console.error(e); }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-3">
      {rows.map(r => (
        <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-semibold text-indigo-600">{r.rank}</div>
            <div>
              <div className="font-semibold">{r.name || r.userName || "Người chơi"}</div>
              <div className="text-sm text-gray-500">{r.courseName || ""}</div>
            </div>
          </div>
          <div className="text-indigo-600 font-bold text-lg">{r.score || 0}</div>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardCourse;
