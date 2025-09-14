import React, { useState } from "react";
import Leaderboard from "./Leaderboard";
import LeaderboardCourse from "./LeaderboardCourse";

const Tabs = ({ active, setActive }) => (
  <div className="inline-flex bg-white/50 rounded-xl p-1 gap-1">
    <button onClick={() => setActive("global")} className={`px-4 py-2 rounded-lg font-medium ${active==="global" ? "bg-white shadow" : "text-gray-600"}`}>Toàn hệ thống</button>
    <button onClick={() => setActive("course")} className={`px-4 py-2 rounded-lg font-medium ${active==="course" ? "bg-white shadow" : "text-gray-600"}`}>Theo khóa học</button>
  </div>
);

const LeaderboardPage = () => {
  const [active, setActive] = useState("global");
  const [sortBy, setSortBy] = useState("score"); // or "name"

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-700">Bảng xếp hạng</h1>
          <div className="flex items-center gap-4">
            <Tabs active={active} setActive={setActive} />
            <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="ml-4 px-3 py-2 border rounded-lg bg-white text-sm">
              <option value="score">Sắp xếp: Điểm (giảm dần)</option>
              <option value="name">Sắp xếp: Tên (A→Z)</option>
            </select>
          </div>
        </header>

        <section className="space-y-6">
          {active==="global" ? (
            <div className="bg-white p-6 rounded-2xl shadow">
              <Leaderboard sortBy={sortBy} />
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow">
              <LeaderboardCourse sortBy={sortBy} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default LeaderboardPage;
