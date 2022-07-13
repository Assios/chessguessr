import { db } from "./firebaseConfig";

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
  increment,
} from "firebase/firestore";

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
