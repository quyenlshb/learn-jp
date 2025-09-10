// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseClient";

import Login from "./Login";
import Dashboard from "./Dashboard";
import Learn from "./Learn";
import Courses from "./Courses"; // màn hình chọn khóa học

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <p>Đang tải...</p>;
  }

  return (
    <Router>
      <Routes>
        {/* Nếu chưa đăng nhập → Login */}
        {!user ? (
          <Route path="*" element={<Login />} />
        ) : (
          <>
            {/* Sau khi đăng nhập → Courses */}
            <Route path="/courses" element={<Courses />} />
            {/* Các route khác */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn/:courseId" element={<Learn />} />
            {/* Nếu login rồi mà vào root → chuyển đến /courses */}
            <Route path="*" element={<Navigate to="/courses" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
