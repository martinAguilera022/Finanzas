// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDMQ5ZZjVTjI2zV1I_dYlSs8Fy2l55qbKE",
  authDomain: "finanzasprox-659eb.firebaseapp.com",
  projectId: "finanzasprox-659eb",
  storageBucket: "finanzasprox-659eb.firebasestorage.app",
  messagingSenderId: "559441882123",
  appId: "1:559441882123:web:ae04c2979a1b40c3dbab0e",
  measurementId: "G-2C8LV2ZJMQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);