import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./firebaseClient";

async function fetchTop(collectionName, lim = 100) {
  try {
    const q = query(collection(db, collectionName), orderBy("score", "desc"), limit(lim));
    const snap = await getDocs(q);
    return snap.docs.map((d, i) => ({ id: d.id, rank: i+1, ...d.data() }));
  } catch (e) {
    return [];
  }
}

const LeaderboardPage = () => {
  const [tab, setTab] = useState("all");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      let data = [];
      if (tab === "all") data = await fetchTop("leaderboard", 100);
      if (tab === "weekly") data = await fetchTop("weeklyLeaderboard", 100);
      if (tab === "monthly") data = await fetchTop("monthlyLeaderboard", 100);
      if (!cancelled) setRows(data);
    }
    load();
    return () => { cancelled = true; }
  }, [tab]);

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-700">Bng xp hng</h1>
          <div className="inline-flex bg-white/50 rounded-xl p-1 gap-1">
            <button onClick={() => setTab("all")} className={`px-4 py-2 rounded-lg font-medium ${tab==="all" ? "bg-white shadow" : "text-gray-600"}`}>Tt c</button>
            <button onClick={() => setTab("weekly")} className={`px-4 py-2 rounded-lg font-medium ${tab==="weekly" ? "bg-white shadow" : "text-gray-600"}`}>Tun</button>
            <button onClick={() => setTab("monthly")} className={`px-4 py-2 rounded-lg font-medium ${tab==="monthly" ? "bg-white shadow" : "text-gray-600"}`}>Thng</button>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-600">Cha c d liu im no. Hy hc th  ln bng xp hng!</div>
        ) : (
          <div className="space-y-3">
            {rows.map(r => (
              <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-semibold text-indigo-600">{r.rank}</div>
                  <div>
                    <div className="font-semibold">{r.name || r.uid || "Ngi dng"}</div>
                    <div className="text-sm text-gray-500">Streak: {r.streakCount || 0}  Badges: {(r.badges||[]).join(", ")}</div>
                  </div>
                </div>
                <div className="text-indigo-600 font-bold text-lg">{r.score||0}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default LeaderboardPage;
