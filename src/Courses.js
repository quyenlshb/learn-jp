import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseClient";

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition p-6 flex flex-col">
    <div className="h-36 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center mb-4">
      <div className="text-3xl font-bold text-indigo-600">{(course.name||"").split(" ").slice(0,2).map(w=>w[0]).join("")}</div>
    </div>
    <h3 className="text-xl font-semibold text-indigo-700 mb-2">{course.name}</h3>
    <p className="text-gray-600 flex-1">{course.description || "Không có mô tả"}</p>
    <div className="mt-4 flex items-center justify-between">
      <Link to={`/courses/${course.id}`} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Vào học</Link>
      <div className="text-sm text-gray-500"> {course.wordsCount || 0} từ</div>
    </div>
  </div>
);

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = await getDocs(collection(db, "courses"));
        setCourses(q.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
    };
    fetchCourses();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">Danh sách khóa học</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => <CourseCard key={c.id} course={c} />)}
        </div>
      </div>
    </main>
  );
};

export default Courses;
