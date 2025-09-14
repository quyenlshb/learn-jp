import React, { useState } from "react";
import Leaderboard from "./Leaderboard";
import LeaderboardCourse from "./LeaderboardCourse";

const TimeTabs = ({ value, onChange }) => (
  <div className="inline-flex bg-white/50 rounded-xl p-1 gap-1">
    <button onClick={() => onChange("daily")} className={`px-4 py-2 rounded-xl ${value==="daily" ? "bg-white shadow" : "text-gray-600"}`}>Ngày</button>
    <button onClick={() => onChange("weekly")} className={`px-4 py-2 rounded-xl ${value==="weekly" ? "bg-white shadow" : "text-gray-600"}`}>Tuần</button>
    <button onClick={() => onChange("monthly")} className={`px-4 py-2 rounded-xl ${value==="monthly" ? "bg-white shadow" : "text-gray-600"}`}>Tháng</button>
    <button onClick={() => onChange("total")} className={`px-4 py-2 rounded-xl ${value==="total" ? "bg-white shadow" : "text-gray-600"}`}>All-time</button>
  </div>
);

const ScopeTabs = ({ value, onChange }) => (
  <div className="inline-flex bg-white/50 rounded-xl p-1 gap-1">
    <button onClick={() => onChange("global")} className={`px-4 py-2 rounded-xl ${value==="global" ? "bg-white shadow" : "text-gray-600"}`}>Toàn hệ thống</button>
    <button onClick={() => onChange("course")} className={`px-4 py-2 rounded-xl ${value==="course" ? "bg-white shadow" : "text-gray-600"}`}>Theo khóa học</button>
  </div>
);

const LeaderboardPage = () => {
  const [scope, setScope] = useState("global");
  const [timeframe, setTimeframe] = useState("daily"); // daily | weekly | monthly | total

  return (
    <main className="p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <div className="flex items-center gap-3">
            <ScopeTabs value={scope} onChange={setScope} />
            <TimeTabs value={timeframe} onChange={setTimeframe} />
          </div>
        </header>

        <section>
          {scope === "global" ? (
            <div className="bg-white p-6 rounded-2xl shadow">
              <Leaderboard sortBy={timeframe} />
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow">
              <LeaderboardCourse sortBy={timeframe} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default LeaderboardPage;
