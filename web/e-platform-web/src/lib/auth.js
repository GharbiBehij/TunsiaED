import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
  } from "firebase/auth";
  import { auth, googleProvider } from "@/firebase/firebase.js";
  
  // Your clean functions
  export const signupWithEmail = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);
  
  export const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  
  export const loginWithGoogle = () =>
    signInWithPopup(auth, googleProvider);
  
  export const signOut = () =>
    signOut();

  
