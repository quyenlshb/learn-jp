import React from "react";
import Leaderboard from "./Leaderboard";
import LeaderboardCourse from "./LeaderboardCourse";

const LeaderboardPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Bảng xếp hạng</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bảng xếp hạng toàn hệ thống</h2>
        <div className="bg-white rounded-2xl shadow p-4">
          <Leaderboard />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Bảng xếp hạng theo khóa học</h2>
        <div className="bg-white rounded-2xl shadow p-4">
          <LeaderboardCourse />
        </div>
      </section>
    </div>
  );
};

export default LeaderboardPage;
