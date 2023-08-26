import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged, User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { isUsernameTaken, saveNewUser } from "./utils";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";

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

    const uid = user.uid;

    await saveNewUser(uid, email, username);
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
