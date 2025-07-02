// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiiHIUGlrlWTuaYbJbmjriSoBxQYhf2_g",
  authDomain: "auth-1e3b8.firebaseapp.com",
  projectId: "auth-1e3b8",
  storageBucket: "auth-1e3b8.appspot.com",
  messagingSenderId: "174260279901",
  appId: "1:174260279901:web:40f7dd5684de0008810bb4",
  measurementId: "G-TQ0M9NXGYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);