// ExampleRoutes.js
// Import and mount these routes in your App.js or router.
// E.g. <Route path='/login' element={<Login/>} /> etc.

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ResetPassword from './Auth/ResetPassword';
import Leaderboard from './Leaderboard/Leaderboard';
import AdminPanel from './Admin/AdminPanel';
import ManageCourses from './Admin/ManageCourses';
import GamifySummary from './components/GamifySummary';

export default function ExampleRoutes(){
  return (<Routes>
    <Route path='/login' element={<Login/>} />
    <Route path='/register' element={<Register/>} />
    <Route path='/reset' element={<ResetPassword/>} />
    <Route path='/leaderboard' element={<Leaderboard/>} />
    <Route path='/admin' element={<AdminPanel/>} />
    <Route path='/admin/courses' element={<ManageCourses/>} />
  </Routes>);
}
