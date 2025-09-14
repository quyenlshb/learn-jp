import React, {useState} from 'react';
import { markLessonCompleted } from '../services/progressService';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebaseClient';
import { getAuth } from 'firebase/auth';

export default function MarkCompleteButton({courseId, lessonId}){
  const [loading,setLoading]=useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const handle = async ()=>{
    if(!user){ alert('Đăng nhập để đánh dấu hoàn thành'); return; }
    setLoading(true);
    try{
      await markLessonCompleted(user.uid, courseId, lessonId);
      // give points to user
      const ud = doc(db, 'users', user.uid);
      await updateDoc(ud, { points: increment(10) });
      alert('Đã đánh dấu hoàn thành +10 điểm!');
    }catch(e){
      console.error(e);
      alert('Lỗi: '+e.message);
    }finally{ setLoading(false); }
  };
  return <button onClick={handle} disabled={loading}>{loading ? 'Đang...' : 'Hoàn thành bài'}</button>;
}
