import React from "react";
import Leaderboard from "./Leaderboard";
import LeaderboardCourse from "./LeaderboardCourse";

const LeaderboardPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        <h1 className="text-4xl font-extrabold text-indigo-700 text-center">Bảng xếp hạng</h1>
        <section className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Top người chơi</h2>
          <Leaderboard />
        </section>
        <section className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Theo khóa học</h2>
          <LeaderboardCourse />
        </section>
      </div>
    </main>
  );
};

export default LeaderboardPage;
