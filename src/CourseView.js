import React from 'react';
import { useParams } from 'react-router-dom';
import MarkCompleteButton from './components/MarkCompleteButton';

export default function CourseView(){
  const { courseId } = useParams();
  // This is a simplified view: show static lesson list for demo
  const lessons = [{id:'l1', title:'Bài 1'}, {id:'l2', title:'Bài 2'}];
  return (<div style={{maxWidth:900,margin:'1rem auto'}}>
    <h3>Course: {courseId}</h3>
    <ul>
      {lessons.map(ls=> <li key={ls.id}>
        {ls.title} — <MarkCompleteButton courseId={courseId} lessonId={ls.id} />
      </li>)}
    </ul>
  </div>);
}
