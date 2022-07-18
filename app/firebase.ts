import {
  applicationDefault,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAozth9aqslPm3leuDijEhOT28_yJKriLU",
  authDomain: "chessguessr-7eb3c.firebaseapp.com",
  projectId: "chessguessr-7eb3c",
  storageBucket: "chessguessr-7eb3c.appspot.com",
  messagingSenderId: "458796929173",
  appId: "1:458796929173:web:1f2b68838af8536b0ecb9c",
};

/*
const app = initializeApp({ credential: applicationDefault() });

export const db = getFirestore(app);
*/

let app;
let auth;
let db;
if (process.env.NODE_ENV === "development") {
  app =
    getApps().length === 0
      ? initializeApp({ projectId: "chessguessr-7eb3c" })
      : getApp();
  db = getFirestore();
} else {
  app =
    getApps().length === 0
      ? initializeApp({ credential: applicationDefault() })
      : getApp();
  db = getFirestore();
}
export { app, auth, db };
