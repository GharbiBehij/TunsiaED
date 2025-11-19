// src/config/firebase.ts
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize only once
if (!admin.apps.length) {
  try {
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
      console.log('Firebase Admin initialized from .env');
    } else {
      throw new Error('Missing Firebase credentials in .env');
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    process.exit(1);
  }
}

// Export services
export const auth = admin.auth();
export const db = admin.firestore();  
export default admin;