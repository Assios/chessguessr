import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import CryptoJS from 'crypto-js';

admin.initializeApp();

const db = admin.firestore();

const initialPlayerStats = {
  gamesPlayed: 0,
  lastPlayed: "",
  currentStreak: 0,
  guesses: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    failed: 0,
  },
};

exports.saveNewUser = functions.auth.user().onCreate(async (user) => {
  const uid = user.uid;
  const email = user.email || '';
  const username = user.displayName || '';

  const emailHash = CryptoJS.MD5(email).toString();
  const userRef = db.collection('users').doc(uid);
  const usernameRef = db.collection('usernames').doc(username);

  const batch = db.batch();

  batch.set(userRef, {
    email,
    username,
    stats: initialPlayerStats,
    emailHash,
    lastUpdatedUsername: admin.firestore.FieldValue.serverTimestamp(),
  });

  batch.set(usernameRef, { uid });

  await batch.commit();
});
