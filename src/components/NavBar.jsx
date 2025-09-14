import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseClient.js';

export default function NavBar({user, onLogout}){
  return (<nav className='nav'>
    <div className='nav-left'>
      <Link to='/'>Learn-JP</Link>
      <Link to='/leaderboard'>BXH</Link>
    </div>
    <div className='nav-right'>
      {user ? (<>
        <span>{user.displayName||user.email}</span>
        <button onClick={onLogout}>Đăng xuất</button>
      </>) : (<>
        <Link to='/login'>Đăng nhập</Link>
        <Link to='/register'>Đăng ký</Link>
      </>)}
    </div>
  </nav>);
}
