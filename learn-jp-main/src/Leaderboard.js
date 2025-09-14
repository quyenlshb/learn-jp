// src/Leaderboard.js
import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./firebaseClient";

/**
 * Props:
 *  - sortBy: 'daily' | 'weekly' | 'monthly' | 'total' (default total)
 *  - limit: number
 */
const Leaderboard = ({ courseId = null, sortBy = "total", limitNum = 50 }) => {
  const [scores, setScores] = useState([]);
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        let orderField = "pointsTotal";
        if (sortBy === "daily") orderField = "pointsDaily";
        if (sortBy === "weekly") orderField = "pointsWeekly";
        if (sortBy === "monthly") orderField = "pointsMonthly";

        const q = query(collection(db, "users"), orderBy(orderField, "desc"), limit(limitNum));
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setScores(data);
      } catch (err) {
        console.error("fetchLeaderboard error:", err);
      }
    };
    fetchLeaderboard();
  }, [sortBy, limitNum]);

  return (
    <aside>
      <h3 className="text-lg font-semibold mb-2">Bảng xếp hạng</h3>
      <ol>
        {scores && scores.length > 0 ? (
          scores.map((s, i) => (
            <div key={s.id || i} style={{ marginBottom: "8px" }} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div style={{display:'flex', alignItems:'center', gap:12}}>
                <div style={{width:44,height:44,borderRadius:22,overflow:'hidden',background:'#ddd'}}>
                  {s.avatarUrl ? <img src={s.avatarUrl} alt="av" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <div style={{width:'100%',height:'100%'}}/>}
                </div>
                <div>
                  <div style={{fontWeight:700}}>{s.displayName || "Ẩn danh"}</div>
                  <div style={{fontSize:12,color:'#666'}}>#{i+1}</div>
                </div>
              </div>
              <div style={{fontWeight:700}}>{s[ sortBy === 'daily' ? 'pointsDaily' : sortBy === 'weekly' ? 'pointsWeekly' : sortBy === 'monthly' ? 'pointsMonthly' : 'pointsTotal' ] || 0} điểm</div>
            </div>
          ))
        ) : (
          <p>Chưa có dữ liệu</p>
        )}
      </ol>
    </aside>
  );
};

export default Leaderboard;
