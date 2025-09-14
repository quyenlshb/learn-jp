import React, {useEffect, useState} from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseClient';

export default function ManageCourses(){
  const [courses, setCourses] = useState([]);
  const [title,setTitle]=useState('');
  const [editing,setEditing]=useState(null);
  useEffect(()=> load(), []);
  async function load(){
    const snaps = await getDocs(collection(db,'courses'));
    setCourses(snaps.docs.map(d=>({id:d.id, ...d.data()})));
  }
  async function create(){
    if(!title) return alert('Nhập tiêu đề');
    await addDoc(collection(db,'courses'), { title, createdAt: new Date().toISOString() });
    setTitle(''); load();
  }
  async function remove(id){
    if(!confirm('Xóa course?')) return;
    await deleteDoc(doc(db,'courses',id)); load();
  }
  async function saveEdit(){
    if(!editing) return;
    await updateDoc(doc(db,'courses',editing.id), { title: editing.title });
    setEditing(null); load();
  }
  return (<div style={{maxWidth:900,margin:'1rem auto'}}>
    <h3>Quản lý Courses</h3>
    <div style={{display:'flex',gap:8,marginBottom:12}}>
      <input placeholder='Tiêu đề course' value={title} onChange={e=>setTitle(e.target.value)} />
      <button onClick={create}>Thêm</button>
    </div>
    <ul>
      {courses.map(c=> (<li key={c.id}>
        {editing && editing.id===c.id ? (<span>
          <input value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})} />
          <button onClick={saveEdit}>Lưu</button>
          <button onClick={()=>setEditing(null)}>Hủy</button>
        </span>) : (<span>
          <strong>{c.title}</strong> — <button onClick={()=>setEditing({id:c.id,title:c.title})}>Sửa</button>
          <button onClick={()=>remove(c.id)}>Xóa</button>
        </span>)}
      </li>))}
    </ul>
  </div>);
}
