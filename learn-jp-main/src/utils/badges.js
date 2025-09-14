// src/utils/badges.js
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseClient";

export const awardBadgeIfNeeded = async (userId, badgeId, badgeName) => {
  if (!userId) return;
  const ref = doc(db, "users", userId, "badges", badgeId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { name: badgeName, awardedAt: new Date().toISOString() });
  }
};
