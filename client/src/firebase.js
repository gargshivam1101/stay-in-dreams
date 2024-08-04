// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "stay-in-dreams.firebaseapp.com",
  projectId: "stay-in-dreams",
  storageBucket: "stay-in-dreams.appspot.com",
  messagingSenderId: "646094612147",
  appId: "1:646094612147:web:9cf8f19db032611e6ff2c6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
