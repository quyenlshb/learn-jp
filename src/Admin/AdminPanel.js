import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPanel(){
  return (<div style={{maxWidth:900,margin:'1rem auto'}}>
    <h2>Admin Panel</h2>
    <ul>
      <li><Link to='/admin/courses'>Quản lý Courses</Link></li>
      <li><Link to='/admin/users'>Quản lý Users</Link></li>
    </ul>
    <p>Chú ý: chỉ người có isAdmin=true trong collection 'users' mới truy cập được.</p>
  </div>);
}
