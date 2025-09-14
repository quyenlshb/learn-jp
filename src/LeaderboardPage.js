import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "./firebaseClient";

const fetchTop = async (collectionName, limitCount=50) => {
  try {
    const q = query(collection(db, collectionName), orderBy("score", "desc"), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map((d,i) => ({ id: d.id, rank: i+1, ...d.data() }));
  } catch (e) {
    console.error("fetchTop error", e);
    return [];
  }
};

const LeaderboardPage = () => {
  const [tab, setTab] = useState("all");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (tab === "all") {
        const r = await fetchTop("leaderboard", 100);
        setRows(r);
      } else if (tab === "weekly") {
        const r = await fetchTop("weeklyLeaderboard", 100);
        setRows(r);
      } else if (tab === "monthly") {
        const r = await fetchTop("monthlyLeaderboard", 100);
        setRows(r);
      }
    };
    load();
  }, [tab]);

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-indigo-700">Bảng xếp hạng</h1>
          <div className="inline-flex bg-white/50 rounded-xl p-1 gap-1">
            <button onClick={() => setTab("all")} className={`px-4 py-2 rounded-lg font-medium ${tab==="all" ? "bg-white shadow" : "text-gray-600"}`}>Tất cả</button>
            <button onClick={() => setTab("weekly")} className={`px-4 py-2 rounded-lg font-medium ${tab==="weekly" ? "bg-white shadow" : "text-gray-600"}`}>Tuần</button>
            <button onClick={() => setTab("monthly")} className={`px-4 py-2 rounded-lg font-medium ${tab==="monthly" ? "bg-white shadow" : "text-gray-600"}`}>Tháng</button>
          </div>
        </div>

        <div className="space-y-3">
          {rows.map(r => (
            <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-semibold text-indigo-600">{r.rank}</div>
                <div>
                  <div className="font-semibold">{r.name || r.uid || "Người dùng"}</div>
                  <div className="text-sm text-gray-500">Streak: {r.streakCount || 0} • Badges: {(r.badges||[]).join(", ")}</div>
                </div>
              </div>
              <div className="text-indigo-600 font-bold text-lg">{r.score||0}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default LeaderboardPage;
