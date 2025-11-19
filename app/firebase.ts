// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZ0VHv__G_wSz3Z4vlSjCoeyaXmtDQS9k",
  authDomain: "ipo-alarm-bot.firebaseapp.com",
  projectId: "ipo-alarm-bot",
  storageBucket: "ipo-alarm-bot.firebasestorage.app",
  messagingSenderId: "699146395480",
  appId: "1:699146395480:web:142e682d3535e49484cf2d",
  measurementId: "G-ZL7J2F07RM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);