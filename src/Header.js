import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseClient";


const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (auth && auth.signOut) auth.signOut();
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 7h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">LearnJP</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/courses" className="hover:underline">Kha hc</Link>
          <Link to="/learn" className="hover:underline">Hc</Link>
          <Link to="/leaderboard" className="hover:underline">Bng xp hng</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <button onClick={handleLogout} className="ml-3 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md">ng xut</button>
        </nav>

        <div className="md:hidden">
          <Link to="/courses" className="text-sm px-3 py-1 rounded-md bg-white/10">Menu</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
