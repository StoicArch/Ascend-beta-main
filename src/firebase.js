import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDc_9XLQCjxuksZ62QbBwTJnYAgwcffyGQ",
  authDomain: "ascend-4c445.firebaseapp.com",
  projectId: "ascend-4c445",
  storageBucket: "ascend-4c445.firebasestorage.app",
  messagingSenderId: "259335041849",
  appId: "1:259335041849:web:5c355ce9ef969978026ee8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider =
  new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});