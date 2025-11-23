import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase';

export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signupWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithRedirect(auth, provider);
};