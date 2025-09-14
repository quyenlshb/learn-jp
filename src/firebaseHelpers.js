// firebaseHelpers.js
// Utilities to manage leaderboard, streaks and badges in Firestore
import { doc, setDoc, updateDoc, getDoc, serverTimestamp, increment } from "firebase/firestore";
import { db } from "./firebaseClient";

// Badge thresholds (icon + label)
const BADGES = [
  { score: 100, id: "rising", label: " Rising Star" },
  { score: 500, id: "champion", label: " Champion" },
  { score: 1000, id: "master", label: " Master" },
];

function getWeekId(d = new Date()) {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const week = Math.ceil((d.getUTCDate()) / 7);
  return `${year}-W${week}`;
}
function getMonthId(d = new Date()) {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export async function addScore(uid, name, points = 0) {
  if (!uid) return;
  const userRef = doc(db, "leaderboard", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, { uid, name: name || "", score: points || 0, badges: [], streakCount: 0, lastActiveDate: null, updatedAt: serverTimestamp() });
  } else {
    await updateDoc(userRef, { score: increment(points || 0), updatedAt: serverTimestamp() });
  }

  // weekly and monthly collections (doc id per user+period)
  try {
    const now = new Date();
    const weekId = getWeekId(now);
    const monthId = getMonthId(now);
    const weekRef = doc(db, "weeklyLeaderboard", uid + "_" + weekId);
    const monthRef = doc(db, "monthlyLeaderboard", uid + "_" + monthId);
    await setDoc(weekRef, { uid, name: name || "", score: increment(points || 0), week: weekId, updatedAt: serverTimestamp() }, { merge: true });
    await setDoc(monthRef, { uid, name: name || "", score: increment(points || 0), month: monthId, updatedAt: serverTimestamp() }, { merge: true });
  } catch (e) {
    // silent fail as requested
  }

  // check badges after update
  try {
    await checkAndAwardBadges(uid);
  } catch (e) {
    // silent
  }
}

export async function checkAndAwardBadges(uid) {
  if (!uid) return;
  const userRef = doc(db, "leaderboard", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;
  const data = snap.data() || {};
  const score = data.score || 0;
  const existing = data.badges || [];
  const toAward = [];
  BADGES.forEach(b => {
    if (score >= b.score && !existing.includes(b.id)) toAward.push(b.id);
  });
  if (toAward.length > 0) {
    // map ids to labels and store as strings like " Rising Star"
    const newBadges = Array.from(new Set([...(existing||[]), ...toAward.map(id => {
      const b = BADGES.find(x => x.id === id);
      return b ? b.label : id;
    })]));
    await updateDoc(userRef, { badges: newBadges });
  }
}

export async function updateStreakOnActivity(uid) {
  if (!uid) return;
  const userRef = doc(db, "leaderboard", uid);
  const snap = await getDoc(userRef);
  const today = new Date().toDateString();
  if (!snap.exists()) {
    await setDoc(userRef, { streakCount: 1, lastActiveDate: today, updatedAt: serverTimestamp() }, { merge: true });
    return;
  }
  const data = snap.data() || {};
  const last = data.lastActiveDate || null;
  if (last === today) return; // already updated today
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  let newStreak = 1;
  if (last === yesterdayStr) {
    newStreak = (data.streakCount || 0) + 1;
  }
  await updateDoc(userRef, { streakCount: newStreak, lastActiveDate: today, updatedAt: serverTimestamp() });
}
