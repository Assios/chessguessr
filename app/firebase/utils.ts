import { db } from "./firebaseConfig";

import {
  setDoc,
  doc,
  getDoc,
  increment,
  writeBatch,
  serverTimestamp,
  arrayUnion,
  runTransaction,
  collection,
  query,
  getDocs,
  orderBy,
  addDoc,
  where,
} from "firebase/firestore";
import { AppUser, PlayerStats } from "~/components/AuthProvider/AuthProvider";
import CryptoJS from "crypto-js";

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
  const normalizedUsername = username.toLowerCase();
  const usernameRef = doc(db, "usernames", normalizedUsername);
  const docSnap = await getDoc(usernameRef);
  return docSnap.exists();
}

export async function saveNewUser(
  uid: string,
  email: string,
  username: string
) {
  const emailHash = CryptoJS.MD5(email).toString();
  const userRef = doc(db, "users", uid);
  const normalizedUsername = username.toLowerCase();
  const usernameRef = doc(db, "usernames", normalizedUsername);

  const activityRef = doc(collection(db, "users", uid, "activities"));

  const batch = writeBatch(db);

  batch.set(userRef, {
    email,
    username,
    stats: initialPlayerStats,
    emailHash,
    lastUpdatedUsername: serverTimestamp(),
    progress: {
      level: 0,
      xp: 0,
    },
  });

  batch.set(usernameRef, { uid });

  batch.set(activityRef, {
    type: "signup",
    message: "Signed up",
    timestamp: serverTimestamp(),
  });

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
      emailVerified: data.emailVerified || false,
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

  const normalizedNewUsername = newUsername.toLowerCase();
  const oldUsernameRef = doc(db, "usernames", oldUsername);
  const newUsernameRef = doc(db, "usernames", normalizedNewUsername);

  const batch = writeBatch(db);

  batch.update(userRef, {
    username: newUsername,
    lastUpdatedUsername: serverTimestamp(),
  });

  if (!oldUsername.startsWith("GoogleUser_")) {
    batch.delete(oldUsernameRef);
  }

  batch.set(newUsernameRef, { uid });

  await batch.commit();

  console.log(`Username update for UID: ${uid} completed successfully.`);
}

import { updateDoc } from "firebase/firestore";
import { isValidPlayerStats } from "~/utils/utils";

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

export async function importStatsFromLocalStorage(
  uid: string,
  localStats: PlayerStats
): Promise<void> {
  const userRef = doc(db, "users", uid);

  if (!isValidPlayerStats(localStats)) {
    console.error("Invalid stats format from localStorage. Aborting import.");
    return;
  }

  try {
    await updateDoc(userRef, {
      stats: localStats,
      importedLocalStorageDate: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "Failed to import stats from localStorage to Firestore:",
      error
    );
  }
}

export async function updateFirstSolverAndAchievement(
  puzzleId: number,
  userId: string,
  username: string,
  achievement: string
) {
  const puzzleDocRef = doc(db, "stats", puzzleId.toString());
  const userDocRef = doc(db, "users", userId);

  const preTransactionPuzzleDocSnap = await getDoc(puzzleDocRef);

  if (!preTransactionPuzzleDocSnap.exists()) {
    throw new Error("No puzzle document found for the given ID.");
  }

  return runTransaction(db, async (transaction) => {
    const puzzleDocSnap = await transaction.get(puzzleDocRef);
    const puzzleData = puzzleDocSnap.data();

    const userDocSnap = await transaction.get(userDocRef);
    const userData = userDocSnap.data();

    if (!userData) {
      console.error("User document does not exist for the given ID.");
      throw new Error("No user document found for the given ID.");
    }

    if (!puzzleData.firstSolver) {
      transaction.update(puzzleDocRef, {
        firstSolver: username,
      });

      const currentAchievements = userData.achievements || [];
      if (!currentAchievements.includes(achievement)) {
        transaction.update(userDocRef, {
          achievements: arrayUnion(achievement),
        });
      }
    }
  });
}

export async function getUserByUsername(
  username: string
): Promise<AppUser | null> {
  const usernameRef = doc(db, "usernames", username);
  const docSnap = await getDoc(usernameRef);
  if (docSnap.exists()) {
    const uid = docSnap.get("uid");
    return getUserFromFirestore(uid);
  }

  return null;
}

export async function getUserActivities(uid: string): Promise<any[]> {
  const activitiesRef = collection(db, "users", uid, "activities");
  const q = query(activitiesRef, orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);

  const activities = [];
  querySnapshot.forEach((doc) => {
    activities.push(doc.data());
  });

  return activities;
}

export async function addActivityToFeed(
  uid: string,
  type: string,
  message: string,
  puzzleId?: number,
  url?: string,
  status?: string
): Promise<void> {
  const activitiesCollection = collection(db, "users", uid, "activities");

  const activityData: any = {
    type: type,
    message: message,
    timestamp: serverTimestamp(),
  };

  if (puzzleId !== undefined) {
    activityData.puzzleId = puzzleId;
  }

  if (url !== undefined) {
    activityData.url = url;
  }

  if (status !== undefined) {
    activityData.status = status;
  }

  try {
    await addDoc(activitiesCollection, activityData);

    console.log(`Activity added successfully for UID: ${uid}.`);
  } catch (error) {
    console.error(`Failed to add activity for UID: ${uid}.`, error);
  }
}

function getStartAndEndOfDay(): { startOfDay: Date; endOfDay: Date } {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  return { startOfDay, endOfDay };
}

export async function hasPlayedDaily(uid: string): Promise<boolean> {
  const { startOfDay, endOfDay } = getStartAndEndOfDay();
  const activitiesCollection = collection(db, "users", uid, "activities");

  const querySnapshot = await getDocs(
    query(
      activitiesCollection,
      where("type", "==", "playedDaily"),
      where("timestamp", ">=", startOfDay),
      where("timestamp", "<", endOfDay)
    )
  );

  return !querySnapshot.empty;
}

export const calculateLevel = (xp: number): number => {
  if (xp < 100) {
    return 1;
  }
  return 2;
};

export async function updateXPAndLevel(
  uid: string,
  xpToAdd: number
): Promise<void> {
  const userRef = doc(db, "users", uid);

  try {
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(userRef);
      if (!docSnap.exists()) {
        throw Error("User does not exist."); // This will abort the transaction
      }

      const userData = docSnap.data() as AppUser;
      const currentXP = userData.progress?.xp || 0;
      const newXP = currentXP + xpToAdd;
      const newLevel = calculateLevel(newXP);

      transaction.update(userRef, {
        "progress.xp": newXP,
        "progress.level": newLevel,
      });
    });
  } catch (error) {
    console.error("Failed to update XP and Level in Firestore:", error);
  }
}
