import React, {useEffect, useState} from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseClient';

export default function AdminManageUsers(){
  const [users, setUsers] = useState([]);
  useEffect(()=> load(), []);
  async function load(){
    const snaps = await getDocs(collection(db,'users'));
    setUsers(snaps.docs.map(d=>({id:d.id, ...d.data()})));
  }
  async function toggleAdmin(u){
    await updateDoc(doc(db,'users',u.id), { isAdmin: !u.isAdmin });
    load();
  }
  async function addPoints(u){
    const num = Number(prompt('Số điểm cộng cho user', '10'));
    if(isNaN(num)) return;
    await updateDoc(doc(db,'users',u.id), { points: (u.points||0) + num });
    load();
  }
  return (<div style={{maxWidth:900,margin:'1rem auto'}}>
    <h3>Quản lý Users</h3>
    <table className='admin-table'>
      <thead><tr><th>Email</th><th>Name</th><th>Points</th><th>Admin</th><th>Actions</th></tr></thead>
      <tbody>
        {users.map(u=> <tr key={u.id}>
          <td>{u.email}</td><td>{u.displayName||'-'}</td><td>{u.points||0}</td>
          <td>{u.isAdmin ? '✅' : '—'}</td>
          <td>
            <button onClick={()=>toggleAdmin(u)}>Toggle Admin</button>
            <button onClick={()=>addPoints(u)}>Add Points</button>
          </td>
        </tr>)}
      </tbody>
    </table>
  </div>);
}
