// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseClient";

import Login from "./Login";
import Dashboard from "./Dashboard";
import Learn from "./Learn";
import CreateCourse from "./CreateCourse";
import Home from "./Home";
import Header from "./Header";
import CourseView from "./CourseView"; // dùng CourseView, bỏ CourseDetail
import Review from "./Review";
import DifficultReview from "./DifficultReview";
import SpeedReview from "./SpeedReview";
import Explore from "./Explore";
import LeaderboardPage from "./LeaderboardPage";
import { ToastProvider } from "./ToastManager";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Đang tải...</p>;

  return (
    <ToastProvider>
    <Router>
      {user && <Header />}
      <Routes>
        {!user ? (
          // Nếu chưa đăng nhập -> luôn về Login
          <Route path="*" element={<Login />} />
        ) : (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn/:courseId" element={<Learn />} />

            {/* View khoá học */}
            <Route path="/course/:id" element={<CourseView />} />

            {/* Các chế độ học */}
           } />
            <Route path="/review/:id" element={<Review />} />
<Route path="/difficult/:id" element={<DifficultReview />} />
            <Route path="/speed-review/:id" element={<div>Trang ôn tập nhanh</div>} />
             <Route path="/speed-review/:id" element={<SpeedReview />} />
<Route path="/explore" element={<Explore />} />
<Route path="/leaderboard" element={<LeaderboardPage />} />

            {/* Route mặc định */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
        <Route path="/leaderboard" element={<LeaderboardPage/>} />\n      </Routes>
    </Router>
    </ToastProvider>
  );
}

export default App;




