// src/utils/points.js
import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";
import { awardBadgeIfNeeded } from "./badges";
import { db } from "../firebaseClient";

// Update multiple point fields atomically
export const addPoints = async (userId, delta, options = {}) => {
  // options: { courseId }
  const courseId = options.courseId || null;
  if (!userId) return;
  const userRef = doc(db, "users", userId);
  try {
    // Ensure user doc exists
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        pointsTotal: 0,
        pointsDaily: 0,
        pointsWeekly: 0,
        pointsMonthly: 0,
        lastActive: new Date().toISOString()
      });
    }
    await updateDoc(userRef, {
      pointsTotal: increment(delta),
      pointsDaily: increment(delta),
      pointsWeekly: increment(delta),
      pointsMonthly: increment(delta),
      lastActive: new Date().toISOString()
    });

    // If courseId provided, also update course-specific leaderboard doc
    if (courseId) {
      try {
        const scoreRef = doc(db, 'courses', courseId, 'scores', userId);
        // create if not exists and increment fields
        await updateDoc(scoreRef, {
          pointsTotal: increment(delta),
          pointsDaily: increment(delta),
          pointsWeekly: increment(delta),
          pointsMonthly: increment(delta),
          lastUpdated: new Date().toISOString()
        }).catch(async (e) => {
          // if update fails (likely doc not exist), set with initial fields
          await setDoc(scoreRef, {
            displayName: (await getDoc(userRef)).data()?.displayName || null,
            avatarUrl: (await getDoc(userRef)).data()?.avatarUrl || null,
            pointsTotal: delta,
            pointsDaily: delta,
            pointsWeekly: delta,
            pointsMonthly: delta,
            lastUpdated: new Date().toISOString()
          }, { merge: true });
        });
      } catch(e) { console.error('course score update error', e); }
    }
    // After updating points, check badges (500/1000/5000)
    try {
      const snap = await getDoc(userRef);
      const total = snap.data()?.pointsTotal || 0;
      if (total >= 500) await awardBadgeIfNeeded(userId, 'points-500', '500 points');
      if (total >= 1000) await awardBadgeIfNeeded(userId, 'points-1000', '1000 points');
      if (total >= 5000) await awardBadgeIfNeeded(userId, 'points-5000', '5000 points');
    } catch(e){ console.error('badge check error', e); }
  } catch (err) {
    console.error("addPoints error:", err);
  }
};

// Reset daily/weekly/monthly points (can be called from Cloud Function or client on date change)
export const resetDaily = async (userId) => {
  if (!userId) return;
  const userRef = doc(db, "users", userId);
  try {
    await updateDoc(userRef, { pointsDaily: 0 });
    // After updating points, check badges (500/1000/5000)
    try {
      const snap = await getDoc(userRef);
      const total = snap.data()?.pointsTotal || 0;
      if (total >= 500) await awardBadgeIfNeeded(userId, 'points-500', '500 points');
      if (total >= 1000) await awardBadgeIfNeeded(userId, 'points-1000', '1000 points');
      if (total >= 5000) await awardBadgeIfNeeded(userId, 'points-5000', '5000 points');
    } catch(e){ console.error('badge check error', e); }
  } catch (err) { console.error(err); }
};
export const resetWeekly = async (userId) => {
  if (!userId) return;
  const userRef = doc(db, "users", userId);
  try {
    await updateDoc(userRef, { pointsWeekly: 0 });
    // After updating points, check badges (500/1000/5000)
    try {
      const snap = await getDoc(userRef);
      const total = snap.data()?.pointsTotal || 0;
      if (total >= 500) await awardBadgeIfNeeded(userId, 'points-500', '500 points');
      if (total >= 1000) await awardBadgeIfNeeded(userId, 'points-1000', '1000 points');
      if (total >= 5000) await awardBadgeIfNeeded(userId, 'points-5000', '5000 points');
    } catch(e){ console.error('badge check error', e); }
  } catch (err) { console.error(err); }
};
export const resetMonthly = async (userId) => {
  if (!userId) return;
  const userRef = doc(db, "users", userId);
  try {
    await updateDoc(userRef, { pointsMonthly: 0 });
    // After updating points, check badges (500/1000/5000)
    try {
      const snap = await getDoc(userRef);
      const total = snap.data()?.pointsTotal || 0;
      if (total >= 500) await awardBadgeIfNeeded(userId, 'points-500', '500 points');
      if (total >= 1000) await awardBadgeIfNeeded(userId, 'points-1000', '1000 points');
      if (total >= 5000) await awardBadgeIfNeeded(userId, 'points-5000', '5000 points');
    } catch(e){ console.error('badge check error', e); }
  } catch (err) { console.error(err); }
};
