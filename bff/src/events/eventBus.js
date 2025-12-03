// Event Bus - Lightweight event emitter for cross-module communication
// Enables decoupled notification sending without tight coupling to Firebase

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Register an event listener
   * @param {string} event - Event name (e.g., 'payment.completed', 'certificate.granted')
   * @param {Function} handler - Handler function (data) => void
   * @returns {Function} Unsubscribe function
   */
  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event).push(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.listeners.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {Object} data - Event payload
   */
  emit(event, data) {
    const handlers = this.listeners.get(event);
    
    if (handlers && handlers.length > 0) {
      // Execute all handlers asynchronously
      handlers.forEach(handler => {
        try {
          // Run handler in next tick to prevent blocking
          setImmediate(() => handler(data));
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for an event
   * @param {string} event - Event name
   */
  off(event) {
    this.listeners.delete(event);
  }

  /**
   * Remove all listeners
   */
  clear() {
    this.listeners.clear();
  }

  /**
   * Get listener count for an event
   * @param {string} event - Event name
   * @returns {number} Number of listeners
   */
  listenerCount(event) {
    const handlers = this.listeners.get(event);
    return handlers ? handlers.length : 0;
  }
}

// Export singleton instance
export const eventBus = new EventBus();
export default eventBus;
