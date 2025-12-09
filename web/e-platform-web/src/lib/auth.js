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
  // Add scopes for email and profile
  provider.addScope('email');
  provider.addScope('profile');
  // Set custom parameters to force account selection
  provider.setCustomParameters({
    prompt: 'select_account',
    // Ensure we get a refresh token
    access_type: 'offline'
  });
  return signInWithRedirect(auth, provider);
};