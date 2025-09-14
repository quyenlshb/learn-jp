import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseClient";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <header
      style={{
        background: "#333",
        color: "#fff",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Bên trái: menu */}
      <nav style={{ display: "flex", gap: "15px" }}>
        <Link
          to="/home"
          style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}
        >
          🏠 Trang chủ
        </Link>
        <Link
          to="/explore"
          style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}
        >
          🌍 Khám phá
        </Link>
        <Link
          to="/leaderboard"
          style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}
        >
          🏆 Bảng xếp hạng
        </Link>
      </nav>

      {/* Bên phải: nút logout */}
      <button
        onClick={handleLogout}
        style={{
          background: "red",
          color: "#fff",
          border: "none",
          padding: "8px 12px",
          cursor: "pointer",
          borderRadius: "5px",
          fontWeight: "bold",
        }}
      >
        Đăng xuất
      </button>
    </header>
  );
};

export default Header;
