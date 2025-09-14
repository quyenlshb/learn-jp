import React, {useEffect, useState} from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseClient';

export default function ManageCourses(){
  const [courses,setCourses] = useState([]);
  const [title,setTitle] = useState('');

  async function load(){
    const snaps = await getDocs(collection(db,'courses'));
    setCourses(snaps.docs.map(d=>({id:d.id,...d.data()})));
  }
  useEffect(()=>{load();},[]);

  async function addCourse(){
    if(!title) return;
    await addDoc(collection(db,'courses'), {title});
    setTitle('');
    load();
  }
  async function remove(id){
    await deleteDoc(doc(db,'courses',id));
    load();
  }

  return (<div style={{maxWidth:600,margin:'1rem auto'}}>
    <h3>Quản lý Courses</h3>
    <input value={title} onChange={e=>setTitle(e.target.value)} placeholder='Tên khóa học'/>
    <button onClick={addCourse}>Thêm</button>
    <ul>
      {courses.map(c=><li key={c.id}>{c.title} <button onClick={()=>remove(c.id)}>Xóa</button></li>)}
    </ul>
  </div>);
}
