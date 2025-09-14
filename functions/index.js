// functions/index.js
/**
 * Cloud Functions:
 *  - resetDaily / resetWeekly / resetMonthly (HTTP endpoints)
 *  - onProgressWrite: Firestore trigger when a user progress doc is created/updated
 *      -> sync user points to courses/{courseId}/scores/{userId}
 *      -> update user's streak and award simple badges
 *
 * Deploy: firebase deploy --only functions
 */

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

async function resetFieldForAllUsers(field) {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();
  const batchSize = 500;
  let batch = db.batch();
  let ops = 0;
  for (const doc of snapshot.docs) {
    batch.update(doc.ref, { [field]: 0 });
    ops++;
    if (ops % batchSize === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }
  if (ops % batchSize !== 0) {
    await batch.commit();
  }
  console.log(`Reset ${field} for ${ops} users`);
}

exports.resetDaily = async (req, res) => {
  try {
    await resetFieldForAllUsers("pointsDaily");
    res.status(200).send("Daily reset done");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
};

exports.resetWeekly = async (req, res) => {
  try {
    await resetFieldForAllUsers("pointsWeekly");
    res.status(200).send("Weekly reset done");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
};

exports.resetMonthly = async (req, res) => {
  try {
    await resetFieldForAllUsers("pointsMonthly");
    res.status(200).send("Monthly reset done");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
};

/**
 * onProgressWrite trigger
 * Trigger path: users/{userId}/progress/{wordId}
 * When a user studies a word, we sync their points to the course leaderboard document:
 *  courses/{courseId}/scores/{userId} with fields: pointsTotal, pointsDaily, pointsWeekly, pointsMonthly, displayName, avatarUrl, lastUpdated
 * Also update user's streak and award badges when thresholds reached.
 */
exports.onProgressWrite = exports.onProgressWrite || null;
const functions = require('firebase-functions');
exports.onProgressWrite = functions.firestore
  .document('users/{userId}/progress/{wordId}')
  .onWrite(async (change, context) => {
    const { userId } = context.params;
    try {
      // load user profile
      const userRef = db.collection('users').doc(userId);
      const userSnap = await userRef.get();
      if (!userSnap.exists) {
        console.log('User doc not found for', userId);
        return null;
      }
      const userData = userSnap.data() || {};

      // Determine courseId from progress doc (after or before)
      const after = change.after.exists ? change.after.data() : null;
      const before = change.before.exists ? change.before.data() : null;
      const progress = after || before;
      if (!progress) return null;

      const courseId = progress.courseId;
      if (!courseId) {
        console.log('No courseId in progress doc for', userId);
      } else {
        // sync to courses/{courseId}/scores/{userId}
        const scoreRef = db.collection('courses').doc(courseId).collection('scores').doc(userId);
        await scoreRef.set({
          displayName: userData.displayName || null,
          avatarUrl: userData.avatarUrl || null,
          pointsTotal: userData.pointsTotal || 0,
          pointsDaily: userData.pointsDaily || 0,
          pointsWeekly: userData.pointsWeekly || 0,
          pointsMonthly: userData.pointsMonthly || 0,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      }

      // update streak logic
      const now = new Date();
      const todayStr = now.toISOString().slice(0,10); // YYYY-MM-DD
      const lastActive = userData.lastActive ? userData.lastActive.slice(0,10) : null;

      let newStreak = userData.streak || 0;
      if (lastActive === todayStr) {
        // already active today - do nothing
      } else {
        // if lastActive was yesterday => increment, else reset to 1
        const yesterday = new Date(now.getTime() - 24*60*60*1000).toISOString().slice(0,10);
        if (lastActive === yesterday) newStreak = (newStreak || 0) + 1;
        else newStreak = 1;
        // update lastActive and streak
        await userRef.update({ lastActive: now.toISOString(), streak: newStreak });
      }

      // award simple badges based on streak or total points
      const badgesRef = userRef.collection ? userRef.collection('badges') : null;
      // badges thresholds
      const badgeOps = [];
      const badgesToAward = [];
      if ((userData.pointsTotal || 0) >= 500) badgesToAward.push({ id: 'points-500', name: '500 points' });
      if ((userData.pointsTotal || 0) >= 1000) badgesToAward.push({ id: 'points-1000', name: '1000 points' });
      if ((userData.pointsTotal || 0) >= 5000) badgesToAward.push({ id: 'points-5000', name: '5000 points' });
      if (newStreak >= 7) badgesToAward.push({ id: 'streak-7', name: '7-day streak' });
      if (newStreak >= 30) badgesToAward.push({ id: 'streak-30', name: '30-day streak' });

      for (const b of badgesToAward) {
        const bref = userRef.collection('badges').doc(b.id);
        const bsnap = await bref.get();
        if (!bsnap.exists) {
          await bref.set({ name: b.name, awardedAt: admin.firestore.FieldValue.serverTimestamp() });
        }
      }

      return null;
    } catch (err) {
      console.error("onProgressWrite error:", err);
      return null;
    }
  });
