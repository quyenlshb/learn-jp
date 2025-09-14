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
    <header className="bg-gradient-to-r from-primary to-indigo-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-white text-2xl font-extrabold tracking-wide">
          LearnJP
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/courses" className="text-white hover:underline">Khóa học</Link>
          <Link to="/leaderboard" className="text-white hover:underline">Bảng xếp hạng</Link>
          <Link to="/learn" className="text-white hover:underline">Học</Link>
          <button
            onClick={handleLogout}
            className="ml-4 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg border border-white/10"
          >
            Đăng xuất
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
