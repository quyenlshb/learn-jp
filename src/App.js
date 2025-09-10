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
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
