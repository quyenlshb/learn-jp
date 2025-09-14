// firebaseHelpers.js
// Utilities to manage leaderboard, streaks and badges in Firestore
import { doc, setDoc, updateDoc, getDoc, serverTimestamp, increment, collection, writeBatch } from "firebase/firestore";
import { db } from "./firebaseClient";

// Badge thresholds
const BADGE_THRESHOLDS = [
  {score: 100, id: "newbie", label: "Newbie"},
  {score: 500, id: "pro", label: "Pro Learner"},
  {score: 1000, id: "master", label: "Master"}
];

export async function addScore(uid, name, points) {
  if (!uid) return;
  const userRef = doc(db, "leaderboard", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    // create initial doc
    await setDoc(userRef, { name: name || "", score: points || 0, badges: [], streakCount: 0, lastActive: serverTimestamp() });
  } else {
    // increment score and update lastActive
    await updateDoc(userRef, { score: increment(points || 0), lastActive: serverTimestamp() });
  }
  // Also update weekly and monthly leaderboards (simple increment using separate collections)
  try {
    const now = new Date();
    const weekId = `${now.getUTCFullYear()}-W${getWeekNumber(now)}`;
    const monthId = `${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,"0")}`;
    const weekRef = doc(db, "weeklyLeaderboard", uid + "_" + weekId);
    const monthRef = doc(db, "monthlyLeaderboard", uid + "_" + monthId);
    await setDoc(weekRef, { uid, name: name || "", score: increment(points || 0), week: weekId, updatedAt: serverTimestamp() }, { merge: true });
    await setDoc(monthRef, { uid, name: name || "", score: increment(points || 0), month: monthId, updatedAt: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.error("Error updating period leaderboards", e);
  }
  // After score change, check badges
  try {
    await checkAndAwardBadges(uid);
  } catch (e) {
    console.error("Badge awarding failed", e);
  }
}

export async function checkAndAwardBadges(uid) {
  const userRef = doc(db, "leaderboard", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;
  const data = snap.data();
  const score = data.score || 0;
  const existing = data.badges || [];
  const toAward = [];
  for (const b of BADGE_THRESHOLDS) {
    if (score >= b.score && !existing.includes(b.id)) {
      toAward.push(b.id);
    }
  }
  if (toAward.length > 0) {
    await updateDoc(userRef, { badges: Array.from(new Set([...(existing||[]), ...toAward])) });
  }
}

export async function updateStreakOnActivity(uid) {
  if (!uid) return;
  const userRef = doc(db, "leaderboard", uid);
  const snap = await getDoc(userRef);
  const today = new Date();
  const todayStr = today.toDateString();
  if (!snap.exists()) {
    await setDoc(userRef, { streakCount: 1, lastActiveDate: todayStr, lastActive: serverTimestamp() }, { merge: true });
    return;
  }
  const data = snap.data();
  const last = data.lastActiveDate || null;
  if (last === todayStr) return; // already recorded today
  const lastDate = last ? new Date(last) : null;
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
  const yesterdayStr = yesterday.toDateString();
  let newStreak = 1;
  if (last === yesterdayStr) {
    newStreak = (data.streakCount || 0) + 1;
  }
  await updateDoc(userRef, { streakCount: newStreak, lastActiveDate: todayStr, lastActive: serverTimestamp() });
}

function getWeekNumber(d) {
  // returns ISO week number
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  return Math.ceil((((date - yearStart) / 86400000) + 1)/7);
}
