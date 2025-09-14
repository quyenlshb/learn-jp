import React from "react";
import Leaderboard from "./Leaderboard";
import LeaderboardCourse from "./LeaderboardCourse";

const LeaderboardPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Bảng xếp hạng</h1>

      <section style={{ marginBottom: "40px" }}>
        <h2>Bảng xếp hạng toàn hệ thống</h2>
        <Leaderboard />
      </section>

      <section>
        <h2>Bảng xếp hạng theo khóa học</h2>
        <LeaderboardCourse />
      </section>
    </div>
  );
};

export default LeaderboardPage;
