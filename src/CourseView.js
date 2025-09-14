import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseClient";

const LessonCard = ({ lesson, idx, onStart }) => (
  <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transform hover:-translate-y-1 transition flex flex-col">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">{idx}</div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{lesson.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
      </div>
    </div>
    <div className="mt-4 flex justify-end">
      <button onClick={() => onStart(lesson.id)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Bắt đầu</button>
    </div>
  </div>
);

const CourseView = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const snap = await getDoc(doc(db, "courses", id));
        if (snap.exists()) setCourse({ id: snap.id, ...snap.data() });
      } catch (e) { console.error(e); }
    };
    const fetchLessons = async () => {
      try {
        const q = await getDocs(collection(db, "courses", id, "lessons"));
        setLessons(q.docs.map((d,i) => ({ id: d.id, idx: i+1, ...d.data() })));
      } catch (e) { console.error(e); }
    };
    fetchCourse();
    fetchLessons();
  }, [id]);

  const handleStart = (lessonId) => {
    // navigate to lesson or open modal
    console.log("Start lesson", lessonId);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold">{course?.name}</h1>
          <p className="mt-2 text-sm opacity-90">{course?.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map(l => <LessonCard key={l.id} lesson={l} idx={l.idx} onStart={handleStart} />)}
        </div>
      </div>
    </main>
  );
};

export default CourseView;
