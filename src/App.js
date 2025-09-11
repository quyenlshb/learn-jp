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
import CourseDetail from "./CourseDetail";
import CourseView from "./CourseView";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Đang tải...</p>;

  return (
    <Router>
      {user && <Header />}
      <Routes>
        {!user ? (
          <Route path="*" element={<Login />} />
        ) : (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn/:courseId" element={<Learn />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/course/:id" element={<CourseView />} />
          <Route path="/course/:id" element={<CourseView />} />
<Route path="/learn-new/:id" element={<div>Trang học từ mới</div>} />
<Route path="/review/:id" element={<div>Trang ôn tập từ đã học</div>} />
<Route path="/difficult/:id" element={<div>Trang ôn tập từ sai nhiều</div>} />
<Route path="/speed-review/:id" element={<div>Trang ôn tập nhanh</div>} />

          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;



