// src/utils/difficultWords.js
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseClient";

// Add or increment mistake count for a word in user's difficultWords collection
export const addDifficultWord = async (userId, word) => {
  if (!userId || !word) return;
  const ref = doc(db, "users", userId, "difficultWords", word.id || word.kanji || word.kana);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        kanji: word.kanji || word.text || "",
        kana: word.kana || word.reading || "",
        meaning: word.meaning || word.mean || "",
        mistakes: 1,
        lastMistake: new Date().toISOString(),
        correctStreak: 0
      });
    } else {
      await updateDoc(ref, {
        mistakes: (snap.data().mistakes || 0) + 1,
        lastMistake: new Date().toISOString(),
        correctStreak: 0
      });
    }
  } catch (err) {
    console.error("addDifficultWord error:", err);
  }
};

// When user answers correctly during difficult review, increment correctStreak; remove if reached threshold
export const handleDifficultCorrect = async (userId, wordId, removeThreshold = 3) => {
  if (!userId || !wordId) return false;
  const ref = doc(db, "users", userId, "difficultWords", wordId);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;
    const data = snap.data();
    const newStreak = (data.correctStreak || 0) + 1;
    if (newStreak >= removeThreshold) {
      // remove doc
      await ref.delete();
      return true; // removed
    } else {
      await updateDoc(ref, { correctStreak: newStreak });
      return false;
    }
  } catch (err) {
    console.error("handleDifficultCorrect error:", err);
    return false;
  }
};
