import React from "react";
import { Link } from "react-router-dom";
import { auth } from "./firebaseClient";

const Header = () => {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <header style={{ padding: "10px", backgroundColor: "#f5f5f5" }}>
      <nav style={{ display: "flex", gap: "15px" }}>
        <Link to="/">Trang chủ</Link>
        <Link to="/explore">Khám phá</Link>
        <Link to="/create-course">Tạo khóa học</Link>
        <Link to="/leaderboard">Bảng xếp hạng</Link> {/* 👈 thêm nút mới */}
        <button onClick={handleLogout}>Đăng xuất</button>
      </nav>
    </header>
  );
};

export default Header;
