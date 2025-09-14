// src/ToastManager.js
import React, { useState, createContext, useContext, useEffect } from "react";
import { db, auth } from "./firebaseClient";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import BadgeModal from "./BadgeModal";
import Toast from "./Toast";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [badge, setBadge] = useState(null);

  useEffect(() => {
    let unsub = null;
    const user = auth.currentUser;
    if (!user) return;
    try {
      const q = query(collection(db, "users", user.uid, "badges"), orderBy("awardedAt", "desc"));
      unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          const newestDoc = snap.docs[0];
          const newest = newestDoc.data();
          const id = newestDoc.id;
          // show modal for newest badge
          setBadge({ id, ...newest });
        }
      });
    } catch(e) { console.error(e); }
    return () => { if (unsub) unsub(); };
  }, []);
  const push = (message, duration) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, duration }]);
    return id;
  };
  const remove = (id) => setToasts((t) => t.filter(x => x.id !== id));
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div>
        {toasts.map(t => <Toast key={t.id} id={t.id} message={t.message} duration={t.duration} onDone={remove} />)}
      <BadgeModal badge={badge} onClose={() => setBadge(null)} />
      </div>
    </ToastContext.Provider>
  );
};
