 import {createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
  import { auth, googleProvider } from "../firebase";
  
  // Your clean functions
  export const signupWithEmail = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);
  
  export const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  
  export const loginWithGoogle = () =>
    signInWithPopup(auth, googleProvider);



  
