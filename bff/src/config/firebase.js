// src/config/firebase.js
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize only once
if (!admin.apps.length) {
  try {
    // Try environment variables first (for Render/production)
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
      console.log('Firebase Admin initialized from environment variables');
    } else {
      // Fallback to serviceAccountKey.json (for local development)
      const serviceAccountPath = join(__dirname, '../../../firebase-credentials.json');
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin initialized from serviceAccountKey.json');
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    console.error('Make sure to set FIREBASE_* environment variables or add firebase-credentials.json');
    process.exit(1);
  }
}

// Export services
export const auth = admin.auth();
export const db = admin.firestore();  