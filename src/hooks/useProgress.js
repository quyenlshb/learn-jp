import { useEffect, useState } from 'react';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseClient';

export default function useProgress(userId, courseId){
  const [progress, setProgress] = useState(null);

  useEffect(()=>{
    if(!userId || !courseId) return;
    const d = doc(db, 'progress', `${userId}_${courseId}`);
    const unsub = onSnapshot(d, snap=>{
      if(snap.exists()) setProgress(snap.data());
      else setProgress({completedLessons:[], percent:0, streak:0});
    });
    return ()=>unsub();
  }, [userId, courseId]);

  return progress;
}
