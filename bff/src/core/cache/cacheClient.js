// Central Cache Client
// Provides unified interface for all Redis caching operations
// Used by orchestrators and services for consistent caching patterns

import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

/**
 * Central cache client with standardized methods
 * All cache operations should use this client for consistency
 */
export const cacheClient = {
  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<any|null>} Parsed value or null if not found
   */
  async get(key) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Set value in cache with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache (will be JSON stringified)
   * @param {number} ttlSeconds - Time to live in seconds (default: 60)
   */
  async set(key, value, ttlSeconds = 60) {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  },

  /**
   * Delete key from cache
   * @param {string} key - Cache key or pattern
   */
  async del(key) {
    await redis.del(key);
  },

  /**
   * Delete multiple keys matching a pattern
   * @param {string} pattern - Redis key pattern (e.g., 'student_dashboard_*')
   */
  async delPattern(pattern) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },

  /**
   * Check if key exists
   * @param {string} key - Cache key
   * @returns {Promise<boolean>}
   */
  async exists(key) {
    const result = await redis.exists(key);
    return result === 1;
  },

  /**
   * Get remaining TTL for a key
   * @param {string} key - Cache key
   * @returns {Promise<number>} TTL in seconds, -1 if no expire, -2 if key doesn't exist
   */
  async ttl(key) {
    return await redis.ttl(key);
  },

  /**
   * Increment a counter
   * @param {string} key - Cache key
   * @param {number} by - Increment amount (default: 1)
   * @returns {Promise<number>} New value after increment
   */
  async incr(key, by = 1) {
    return await redis.incrby(key, by);
  },

  /**
   * Get the underlying Redis client for advanced operations
   * Use sparingly - prefer using the abstracted methods above
   */
  getClient() {
    return redis;
  },
};

// Export for backward compatibility with existing imports
export const cache = cacheClient;
export default cacheClient;
