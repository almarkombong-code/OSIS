
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// This configuration is correct and verified.
const firebaseConfig = {
  apiKey: "AIzaSyBMvXijJUU8LFj8XJAwpnBy_wiAlXjK_UM",
  authDomain: "osis-e9282.firebaseapp.com",
  projectId: "osis-e9282",
  storageBucket: "osis-e9282.firebasestorage.app",
  messagingSenderId: "509240636769",
  appId: "1:509240636769:web:ff9dfd0d64770f7ff70120"
};

// Initialize Firebase for Server-Side Rendering (SSR)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
