// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseClient";
import { addScore, updateStreakOnActivity } from "./firebaseHelpers";


import Login from "./Login";
import Dashboard from "./Dashboard";
import Learn from "./Learn";
import CreateCourse from "./CreateCourse";
import Home from "./Home";
import Header from "./Header";
import CourseView from "./CourseView"; // dng CourseView, b CourseDetail
import LearnNew from "./LearnNew";
import Review from "./Review";
import DifficultReview from "./DifficultReview";
import SpeedReview from "./SpeedReview";
import Explore from "./Explore";
import LeaderboardPage from "./LeaderboardPage";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>ang ti...</p>;

  return (
    <Router>
      {user && <Header />}
      <Routes>
        {!user ? (
          // Nu cha ng nhp -> lun v Login
          <Route path="*" element={<Login />} />
        ) : (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn/:courseId" element={<Learn />} />

            {/* View kho hc */}
            <Route path="/course/:id" element={<CourseView />} />

            {/* Cc ch  hc */}
           <Route path="/learn-new/:id" element={<LearnNew />} />
            <Route path="/review/:id" element={<Review />} />
<Route path="/difficult/:id" element={<DifficultReview />} />
            <Route path="/speed-review/:id" element={<div>Trang n tp nhanh</div>} />
             <Route path="/speed-review/:id" element={<SpeedReview />} />
<Route path="/explore" element={<Explore />} />
<Route path="/leaderboard" element={<LeaderboardPage />} />

            {/* Route mc nh */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
        <Route path="/leaderboard" element={<LeaderboardPage/>} />\n      </Routes>
    </Router>
  );
}

export default App;




