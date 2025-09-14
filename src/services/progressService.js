import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebaseClient.js';

export async function markLessonCompleted(userId, courseId, lessonId){
  const id = `${userId}_${courseId}`;
  const d = doc(db, 'progress', id);
  try{
    await setDoc(d, { userId, courseId, completedLessons: arrayUnion(lessonId), updatedAt: new Date().toISOString() }, { merge: true });
    // note: percent and streak calculation can be handled server-side or here with extra reads; keep simple
  }catch(e){
    throw e;
  }
}
