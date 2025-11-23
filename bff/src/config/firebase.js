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
    } 
    // Fallback to serviceAccountKey.json (for local development
    } catch (error) {
    console.error('Firebase initialization failed:', error);
    process.exit(1);
  }
}

// Export services
export const auth = admin.auth();
export const db = admin.firestore();  