import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAozth9aqslPm3leuDijEhOT28_yJKriLU",
  authDomain: "chessguessr-7eb3c.firebaseapp.com",
  projectId: "chessguessr-7eb3c",
  storageBucket: "chessguessr-7eb3c.appspot.com",
  messagingSenderId: "458796929173",
  appId: "1:458796929173:web:1f2b68838af8536b0ecb9c",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
}
