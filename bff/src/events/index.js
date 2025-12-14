// Events module - Event bus and emitters
// Import and initialize all emitters in app.js

export { eventBus, default as EventBus } from './eventBus.js';
export { initializeFirebaseNotifications } from './emitters/firebaseNotificationEmitter.js';

/**
 * Initialize all event emitters
 * Call this once during app startup (in app.js)
 */
export function initializeEvents() {
  const { initializeFirebaseNotifications } = require('./emitters/firebaseNotificationEmitter.js');
  
  // Initialize Firebase notification emitter
  initializeFirebaseNotifications();
  
  console.log('✅ Event system initialized');
}
