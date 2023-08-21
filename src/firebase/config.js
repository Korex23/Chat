import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDpQhEZbelarl3XfvSBFHtO7OCsSJXjdVc",
  authDomain: "korexchat.firebaseapp.com",
  projectId: "korexchat",
  storageBucket: "korexchat.appspot.com",
  messagingSenderId: "978379311124",
  appId: "1:978379311124:web:7f155b0183783bcac7bf01",
  measurementId: "G-M9HDVWT7K1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();

// export const db = getFirestore(app);
// export const storage = getStorage(app);
