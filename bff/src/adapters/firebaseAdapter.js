// Firebase Adapter
// Centralized Firebase operations (auth, firestore, messaging)
// Isolates Firebase SDK from business logic

import { auth, db } from '../config/firebase.js';
import admin from 'firebase-admin';

/**
 * Firebase Authentication Adapter
 */
export const FirebaseAuthAdapter = {
  /**
   * Verify ID token
   * @param {string} idToken - Firebase ID token
   * @returns {Promise<Object>} Decoded token
   */
  async verifyIdToken(idToken) {
    return await auth.verifyIdToken(idToken);
  },

  /**
   * Get user by UID
   * @param {string} uid - User ID
   * @returns {Promise<Object>} User record
   */
  async getUserByUid(uid) {
    return await auth.getUser(uid);
  },

  /**
   * Create user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} User record
   */
  async createUser(userData) {
    return await auth.createUser(userData);
  },

  /**
   * Update user
   * @param {string} uid - User ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated user record
   */
  async updateUser(uid, updates) {
    return await auth.updateUser(uid, updates);
  },

  /**
   * Delete user
   * @param {string} uid - User ID
   * @returns {Promise<void>}
   */
  async deleteUser(uid) {
    return await auth.deleteUser(uid);
  },

  /**
   * Set custom claims
   * @param {string} uid - User ID
   * @param {Object} claims - Custom claims
   * @returns {Promise<void>}
   */
  async setCustomClaims(uid, claims) {
    return await auth.setCustomUserClaims(uid, claims);
  },
};

/**
 * Firebase Firestore Adapter
 */
export const FirebaseFirestoreAdapter = {
  /**
   * Get database instance
   * @returns {Object} Firestore db
   */
  getDb() {
    return db;
  },

  /**
   * Get document
   * @param {string} collection - Collection name
   * @param {string} docId - Document ID
   * @returns {Promise<Object|null>} Document data or null
   */
  async getDoc(collection, docId) {
    const doc = await db.collection(collection).doc(docId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  /**
   * Set document
   * @param {string} collection - Collection name
   * @param {string} docId - Document ID
   * @param {Object} data - Document data
   * @returns {Promise<void>}
   */
  async setDoc(collection, docId, data) {
    await db.collection(collection).doc(docId).set(data);
  },

  /**
   * Update document
   * @param {string} collection - Collection name
   * @param {string} docId - Document ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<void>}
   */
  async updateDoc(collection, docId, updates) {
    await db.collection(collection).doc(docId).update(updates);
  },

  /**
   * Delete document
   * @param {string} collection - Collection name
   * @param {string} docId - Document ID
   * @returns {Promise<void>}
   */
  async deleteDoc(collection, docId) {
    await db.collection(collection).doc(docId).delete();
  },

  /**
   * Query collection
   * @param {string} collection - Collection name
   * @param {Array} queryConstraints - Array of [field, operator, value]
   * @returns {Promise<Array>} Query results
   */
  async queryCollection(collection, queryConstraints = []) {
    let query = db.collection(collection);
    
    for (const [field, operator, value] of queryConstraints) {
      query = query.where(field, operator, value);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Batch write
   * @returns {Object} Batch instance
   */
  batch() {
    return db.batch();
  },

  /**
   * Get server timestamp
   * @returns {Object} Server timestamp
   */
  serverTimestamp() {
    return admin.firestore.FieldValue.serverTimestamp();
  },
};

/**
 * Firebase Cloud Messaging Adapter
 */
export const FirebaseMessagingAdapter = {
  /**
   * Send notification to device
   * @param {string} token - Device FCM token
   * @param {Object} notification - Notification payload
   * @returns {Promise<string>} Message ID
   */
  async sendToDevice(token, notification) {
    const messaging = admin.messaging();
    const message = {
      token,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
    };
    return await messaging.send(message);
  },

  /**
   * Send notification to multiple devices
   * @param {Array<string>} tokens - Device FCM tokens
   * @param {Object} notification - Notification payload
   * @returns {Promise<Object>} Batch response
   */
  async sendMulticast(tokens, notification) {
    const messaging = admin.messaging();
    const message = {
      tokens,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
    };
    return await messaging.sendEachForMulticast(message);
  },

  /**
   * Send to topic
   * @param {string} topic - Topic name
   * @param {Object} notification - Notification payload
   * @returns {Promise<string>} Message ID
   */
  async sendToTopic(topic, notification) {
    const messaging = admin.messaging();
    const message = {
      topic,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
    };
    return await messaging.send(message);
  },

  /**
   * Subscribe tokens to topic
   * @param {Array<string>} tokens - Device tokens
   * @param {string} topic - Topic name
   * @returns {Promise<Object>} Subscription response
   */
  async subscribeToTopic(tokens, topic) {
    const messaging = admin.messaging();
    return await messaging.subscribeToTopic(tokens, topic);
  },

  /**
   * Unsubscribe tokens from topic
   * @param {Array<string>} tokens - Device tokens
   * @param {string} topic - Topic name
   * @returns {Promise<Object>} Subscription response
   */
  async unsubscribeFromTopic(tokens, topic) {
    const messaging = admin.messaging();
    return await messaging.unsubscribeFromTopic(tokens, topic);
  },
};

export default {
  auth: FirebaseAuthAdapter,
  firestore: FirebaseFirestoreAdapter,
  messaging: FirebaseMessagingAdapter,
};
