import { db } from "./firebaseConfig";

import {
  setDoc,
  doc,
  getDoc,
  increment,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { AppUser, PlayerStats } from "~/components/AuthProvider/AuthProvider";

const initialPlayerStats: PlayerStats = {
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

export const incrementSolved = (id: number, turns: number) => {
  const statsDoc = doc(db, "stats", id.toString());
  return setDoc(
    statsDoc,
    {
      solved: increment(1),
      turns: increment(turns),
    },
    { merge: true }
  );
};

export const incrementFailed = (id: number) => {
  const statsDoc = doc(db, "stats", id.toString());
  return setDoc(
    statsDoc,
    {
      failed: increment(1),
    },
    { merge: true }
  );
};

export async function isUsernameTaken(username: string): Promise<boolean> {
  const usernameRef = doc(db, "usernames", username);
  const docSnap = await getDoc(usernameRef);
  return docSnap.exists();
}

export async function saveNewUser(
  uid: string,
  email: string,
  username: string
) {
  const userRef = doc(db, "users", uid);
  const usernameRef = doc(db, "usernames", username);

  const batch = writeBatch(db);

  batch.set(userRef, {
    email,
    username,
    stats: initialPlayerStats,
    lastUpdatedUsername: serverTimestamp(),
  });

  batch.set(usernameRef, { uid });

  await batch.commit();
}

export async function getUserFromFirestore(
  uid: string
): Promise<AppUser | null> {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as AppUser;
    return {
      uid,
      ...data,
    };
  } else {
    return null;
  }
}

export async function updateUsername(
  uid: string,
  newUsername: string
): Promise<void> {
  console.log(
    `Attempting to update username for UID: ${uid} to: ${newUsername}`
  );

  if (await isUsernameTaken(newUsername)) {
    console.error(`Username "${newUsername}" is already taken.`);
    throw new Error("Username is already taken.");
  }

  const userRef = doc(db, "users", uid);
  const oldUsernameData = await getDoc(userRef);

  if (!oldUsernameData.exists()) {
    console.error(`User with UID: ${uid} does not exist.`);
    throw new Error("User does not exist.");
  }

  const oldUsername = oldUsernameData.get("username");
  console.log(`Current username for UID: ${uid} is: ${oldUsername}`);

  const oldUsernameRef = doc(db, "usernames", oldUsername);
  const newUsernameRef = doc(db, "usernames", newUsername);

  const batch = writeBatch(db);

  batch.update(userRef, {
    username: newUsername,
    lastUpdatedUsername: serverTimestamp(),
  });

  batch.delete(oldUsernameRef);
  batch.set(newUsernameRef, { uid });

  await batch.commit();

  console.log(`Username update for UID: ${uid} completed successfully.`);
}

import { updateDoc } from "firebase/firestore";

export async function updateUserStats(
  uid: string,
  stats: PlayerStats
): Promise<void> {
  const userRef = doc(db, "users", uid);
  try {
    await updateDoc(userRef, { stats: stats });
  } catch (error) {
    console.error("Failed to update stats in Firestore:", error);
  }
}
