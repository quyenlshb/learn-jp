import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseClient.js';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ResetPassword from './Auth/ResetPassword';
import Leaderboard from './Leaderboard/Leaderboard';
import AdminPanel from './Admin/AdminPanel';
import ManageCourses from './Admin/ManageCourses';
import AdminManageUsers from './Admin/AdminManageUsers';
import GamifySummary from './components/GamifySummary';
import NavBar from './components/NavBar';
import CourseView from './CourseView';
import MarkCompleteButton from './components/MarkCompleteButton';
import './styles.css';

function RequireAuth({children}){
  const [user, setUser] = useState(undefined);
  useEffect(()=> onAuthStateChanged(auth,u=> setUser(u)), []);
  if(user===undefined) return null;
  return user ? children : <Navigate to='/login' replace />;
}

function AdminRoute({children}){
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      if(!u){ setIsAdmin(false); setChecking(false); return; }
      const d = doc(db, 'users', u.uid);
      const snap = await getDoc(d);
      const data = snap.exists() ? snap.data() : {};
      setIsAdmin(!!data.isAdmin);
      setChecking(false);
    });
    return ()=>unsub();
  },[]);
  if(checking) return null;
  return isAdmin ? children : <Navigate to='/' replace />;
}

export default function App(){
  const [user, setUser] = useState(null);
  useEffect(()=> onAuthStateChanged(auth, u=> setUser(u)), []);
  return (<Router>
    <NavBar user={user} onLogout={()=> signOut(auth)} />
    <div style={{padding:12}}>
      <Routes>
        <Route path='/' element={<div>
          <h2>Welcome to Learn-JP</h2>
          <p>Start learning: <Link to='/courses/intro'>Example Course</Link></p>
          <GamifySummary progress={null} />
        </div>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/reset' element={<ResetPassword/>} />
        <Route path='/course/:courseId' element={<RequireAuth><CourseView/></RequireAuth>} />
        <Route path='/leaderboard' element={<Leaderboard/>} />
        <Route path='/admin' element={<AdminRoute><AdminPanel/></AdminRoute>} />
        <Route path='/admin/courses' element={<AdminRoute><ManageCourses/></AdminRoute>} />
        <Route path='/admin/users' element={<AdminRoute><AdminManageUsers/></AdminRoute>} />
      </Routes>
    </div>
  </Router>);
}
