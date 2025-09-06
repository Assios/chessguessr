import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged, onIdTokenChanged, User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { isUsernameTaken, saveNewUser } from "./utils";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import {
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { generateRandomUsername } from "~/utils/username";

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error("Error signing in:", error);
    return null;
  }
};

export const signInWithEmailOrUsername = async (
  identifier: string,
  password: string
) => {
  try {
    let email = identifier;

    if (!identifier.includes("@")) {
      const usernameRef = doc(db, "usernames", identifier);
      const docSnap = await getDoc(usernameRef);

      if (!docSnap.exists()) {
        throw new Error("Username not found");
      }

      const uid = docSnap.data().uid;
      const userRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userRef);

      email = userDocSnap.data().email;
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    return null;
  }
};

export async function signUpWithEmailPasswordAndUsername(
  email: string,
  password: string,
  username: string
) {
  const usernameExists = await isUsernameTaken(username);
  if (usernameExists) {
    throw new Error("Username already taken");
  }

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (userCredential.user) {
    const user = userCredential.user;

    await sendEmailVerification(user);

    await new Promise<void>((resolve) => {
      let settled = false;
      const timeout = setTimeout(() => {
        if (!settled) {
          settled = true;
          resolve();
        }
      }, 1500);
      const unsub1 = onAuthStateChanged(auth, (u) => {
        if (!settled && u?.uid === user.uid) {
          settled = true;
          clearTimeout(timeout);
          unsub1();
          resolve();
        }
      });
    });
    const ensureToken = async () => {
      try {
        await user.getIdToken(true);
      } catch {}
    };

    const uid = user.uid;

    let lastErr: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await ensureToken();
        await saveNewUser(uid, email, username);
        lastErr = null;
        break;
      } catch (e: any) {
        lastErr = e;
        const msg = String(e?.code || e?.message || e);
        if (msg.includes("permission") || msg.includes("unauth")) {
          await new Promise((r) => setTimeout(r, 400 * Math.pow(2, attempt)));
          continue;
        } else {
          break;
        }
      }
    }
    if (lastErr) throw lastErr;
  } else {
    throw new Error("Failed to create a user");
  }
}

export const logOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    return false;
  }
};

export const observeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9]{1,16}$/;
  return usernameRegex.test(username);
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      let candidate = generateRandomUsername(16, user.uid);
      let attempts = 0;
      while (await isUsernameTaken(candidate.toLowerCase())) {
        attempts++;
        const n = Math.floor(Math.random() * 1679616).toString(36).toUpperCase();
        const baseMax = Math.max(3, 16 - n.length);
        candidate = (generateRandomUsername(baseMax, user.uid + attempts) + n).slice(0, 16);
        if (attempts > 25) break;
      }

      try {
        await user.getIdToken(true);
      } catch {}
      await saveNewUser(user.uid, user.email!, candidate);
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};
