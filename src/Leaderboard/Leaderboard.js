import React, {useEffect, useState} from 'react';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseClient';

export default function Leaderboard(){
  const [top, setTop] = useState([]);
  const [mode, setMode] = useState('total'); // total or weekly
  useEffect(()=> load(), [mode]);
  async function load(){
    if(mode==='total'){
      const q = query(collection(db,'users'), orderBy('points','desc'), limit(50));
      const snaps = await getDocs(q);
      setTop(snaps.docs.map(d=>({id:d.id, ...d.data()})));
    }else{
      // load latest weekly leaderboard doc under leaderboards/weekly/current
      const ref = doc(db, 'leaderboards', 'weekly_current');
      const snap = await getDoc(ref);
      setTop(snap.exists() ? snap.data().top || [] : []);
    }
  }
  return (<div style={{maxWidth:800,margin:'1rem auto'}}>
    <h2>BXH - Leaderboard</h2>
    <div style={{marginBottom:12}}>
      <button onClick={()=>setMode('total')}>Tổng</button>
      <button onClick={()=>setMode('weekly')}>Tuần</button>
    </div>
    <ol>
      {top.map((u,idx)=> <li key={u.id||idx}>{u.displayName||u.email} — {u.points||u.score||0} điểm</li>)}
    </ol>
  </div>);
}
