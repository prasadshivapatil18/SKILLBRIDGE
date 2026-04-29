import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYIVxR2VQmdtcEzkt7oHT7zEuX3GiNtjs",
  authDomain: "swapweb-30b2f.firebaseapp.com",
  projectId: "swapweb-30b2f",
  storageBucket: "swapweb-30b2f.firebasestorage.app",
  messagingSenderId: "592287067924",
  appId: "1:592287067924:web:186112f445fa8ce9ea1c01",
  measurementId: "G-CLM8TKZY41"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
