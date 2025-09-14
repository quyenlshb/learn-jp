import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./firebaseClient";

const Badge = ({ rank }) => {
  const styles = {
    1: "bg-yellow-400 text-white",
    2: "bg-slate-300 text-gray-800",
    3: "bg-amber-700 text-white",
  };
  return <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${styles[rank] || "bg-gray-200"}`}>{rank}</div>;
};

const Leaderboard = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("score", "desc"), limit(50));
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
            <Badge rank={r.rank} />
            <div>
              <div className="font-semibold">{r.displayName || r.email || "Người dùng"}</div>
              <div className="text-sm text-gray-500">Level {r.level || 1}</div>
            </div>
          </div>
          <div className="text-indigo-600 font-bold text-lg">{r.score || 0}</div>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
