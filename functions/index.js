// Firebase Functions skeleton for weekly leaderboard aggregation
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

/**
 * Scheduled function to aggregate weekly leaderboard.
 * - Runs every Sunday midnight (UTC) (cron schedule can be adjusted)
 * - Grabs top users by points and writes to leaderboards/weekly_current
 */
exports.weeklyLeaderboard = functions.pubsub.schedule('0 0 * * 0').timeZone('UTC').onRun(async (context) => {
  try{
    const usersSnap = await db.collection('users').orderBy('points','desc').limit(100).get();
    const top = usersSnap.docs.map(d => ({ id: d.id, displayName: d.data().displayName || d.data().email, points: d.data().points || 0 }));
    // write snapshot to leaderboards collection with timestamped doc (optional)
    const now = new Date();
    const y = now.getUTCFullYear();
    const week = getWeekNumber(now);
    const docId = `${y}-W${week}`;
    await db.collection('leaderboards').doc(docId).set({ top, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    // also write a current pointer
    await db.collection('leaderboards').doc('weekly_current').set({ top, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    console.log('Weekly leaderboard updated', docId);
    return null;
  }catch(err){
    console.error('Error aggregating leaderboard', err);
    return null;
  }
});

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1)/7);
  return weekNo;
}
