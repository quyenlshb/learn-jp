// src/Dashboard.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "./firebaseClient";
import BadgeModal from "./components/BadgeModal";

const Dashboard = () => {
  const [badges, setBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    const fetchBadges = async () => {
      if (!auth.currentUser) return;
      const ref = collection(db, "users", auth.currentUser.uid, "badges");
      const snap = await getDocs(ref);
      setBadges(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchBadges();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <h3 className="text-lg font-semibold mb-2">Badges</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map(b => (
          <div key={b.id} onClick={() => setSelectedBadge(b)} className="cursor-pointer border rounded p-2 hover:bg-gray-100">
            <span role="img" aria-label="badge">🏅</span> {b.name}
          </div>
        ))}
      </div>
      {selectedBadge && (
        <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
      )}
    </div>
  );
};

export default Dashboard;
