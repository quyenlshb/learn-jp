import React from 'react';

export default function GamifySummary({progress}){
  if(!progress) return null;
  return (<div style={{border:'1px solid #ddd',padding:12,borderRadius:8}}>
    <h4>Gamification</h4>
    <p>Streak: {progress.streak ?? 0} ngày</p>
    <p>Bài đã hoàn thành: {(progress.completedLessons||[]).length}</p>
  </div>);
}
