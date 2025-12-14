import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics only in browsers that support it
isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});
export const auth=getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
export const firebaseUser=auth.currentUser
export default app;
