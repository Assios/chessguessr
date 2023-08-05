import { db } from "./firebaseConfig";

import { setDoc, doc, getDoc, increment } from "firebase/firestore";
import { AppUser } from "~/components/AuthProvider/AuthProvider";

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

  await setDoc(userRef, { email, username });
  await setDoc(usernameRef, { uid });
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
