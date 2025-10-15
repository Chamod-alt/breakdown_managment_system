// Import Firebase SDKs
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6oz8ByvNsHZTVkWlO_s1OKysSRXI06Ho",
  authDomain: "breakdown-managment-system.firebaseapp.com",
  databaseURL: "https://breakdown-managment-system-default-rtdb.firebaseio.com",
  projectId: "breakdown-managment-system",
  storageBucket: "breakdown-managment-system.firebasestorage.app",
  messagingSenderId: "1021734538757",
  appId: "1:1021734538757:web:679094e39652c0912f566c",
  measurementId: "G-171E9J06HV"
};

// Initialize Firebase app safely (prevent re-initialize)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize services AFTER app is created
const auth = getAuth(app);
const database = getDatabase(app);

// Export objects
export { app, auth, database };
