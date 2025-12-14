// Central Cache Client
// Provides unified interface for all Redis caching operations
// Used by orchestrators and services for consistent caching patterns

import Redis from 'ioredis';

// ====================================================================
// REDIS CACHE KEY REGISTRY
// ====================================================================

/**
 * Centralized registry of all Redis cache key patterns used in the application
 * This ensures consistency across all cache operations and makes it easy to
 * track and manage cache invalidation patterns.
 */
export const REDIS_KEY_REGISTRY = {
  // Dashboard caches
  INSTRUCTOR_DASHBOARD: (userId) => `dashboard:instructor:${userId}`,
  STUDENT_DASHBOARD: (userId) => `dashboard:student:${userId}`,
  STUDENT_LEARNING_OVERVIEW: (userId) => `dashboard:learning:${userId}`,

  // Progress and enrollment caches
  USER_PROGRESS: (userId, courseId) => `progress:user:${userId}:course:${courseId}`,
  COURSE_PROGRESS: (courseId, userId) => `progress:course:${courseId}:user:${userId}`,
  USER_PROGRESS_OVERVIEW: (userId) => `progress:overview:${userId}`,
  USER_PROGRESS_BY_ENROLLMENT: (userId, enrollmentId) => `progress:user:${userId}:enrollment:${enrollmentId}`,
  
  // Enrollment caches
  ENROLLMENT: (enrollmentId) => `enrollment:${enrollmentId}`,
  USER_ENROLLMENTS: (userId) => `enrollments:user:${userId}`,
  COURSE_ENROLLMENTS: (courseId) => `enrollments:course:${courseId}`,
  USER_COURSE_ENROLLMENT: (userId, courseId) => `enrollment:user:${userId}:course:${courseId}`,

  // Certificate caches
  CERTIFICATE: (certificateId) => `certificate:${certificateId}`,
  USER_CERTIFICATES: (userId) => `certificates:user:${userId}`,
  COURSE_CERTIFICATES: (courseId) => `certificates:course:${courseId}`,

  // Transaction and payment caches
  TRANSACTION: (transactionId) => `transaction:${transactionId}`,
  PAYMENT: (paymentId) => `payment:${paymentId}`,
  USER_TRANSACTIONS: (userId) => `transactions:user:${userId}`,
  USER_PAYMENTS: (userId) => `payments:user:${userId}`,
  COURSE_PAYMENTS: (courseId) => `payments:course:${courseId}`,

  // Instructor analytics
  INSTRUCTOR_REVENUE: (userId) => `analytics:revenue:instructor:${userId}`,
  INSTRUCTOR_COURSE_STATS: (userId, courseId) => `analytics:course:${courseId}:instructor:${userId}`,
  INSTRUCTOR_STUDENTS: (userId) => `analytics:students:instructor:${userId}`,
  
  // Course caches
  COURSE: (courseId) => `course:${courseId}`,
  COURSE_CONTENT: (courseId) => `content:course:${courseId}`,
  COURSE_CHAPTERS: (courseId) => `chapters:course:${courseId}`,
  COURSE_LESSONS: (courseId) => `lessons:course:${courseId}`,
  
  // Purchase flow caches
  PURCHASE_STATUS: (paymentId) => `purchase:status:${paymentId}`,
  STRIPE_SESSION: (sessionId) => `stripe:session:${sessionId}`,

  // Pattern matchers for bulk invalidation
  PATTERNS: {
    INSTRUCTOR_DASHBOARD: 'dashboard:instructor:*',
    STUDENT_DASHBOARD: 'dashboard:student:*',
    USER_PROGRESS: 'progress:user:*',
    ENROLLMENTS: 'enrollments:*',
    CERTIFICATES: 'certificates:*',
    TRANSACTIONS: 'transactions:*',
    PAYMENTS: 'payments:*',
    ANALYTICS: 'analytics:*',
    COURSES: 'course:*',
  },
};

// ====================================================================
// REDIS CLIENT INITIALIZATION
// ====================================================================
let redis = null;
let redisEnabled = false;

// Only initialize Redis if explicitly enabled via REDIS_ENABLED env var
if (process.env.REDIS_ENABLED === 'true') {
  try {
    const redisConfig = {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: () => null, // Don't retry on connection failure
      lazyConnect: true, // Don't connect immediately
    };

    // Enable TLS if connecting to Upstash or other cloud Redis
    if (process.env.REDIS_HOST && process.env.REDIS_HOST.includes('upstash.io')) {
      redisConfig.tls = {};
    }

    redis = new Redis(redisConfig);

    redis.on('error', (err) => {
      console.warn('⚠️  Redis connection error (caching disabled):', err.message);
      redisEnabled = false;
    });

    redis.on('connect', () => {
      console.log('✅ Redis cache connected');
      redisEnabled = true;
    });

    // Attempt connection
    redis.connect().catch(() => {
      console.warn('⚠️  Redis not available (caching disabled)');
      redisEnabled = false;
    });
  } catch (err) {
    console.warn('⚠️  Redis initialization failed (caching disabled):', err.message);
    redis = null;
    redisEnabled = false;
  }
} else {
  console.log('ℹ️  Redis caching disabled (set REDIS_ENABLED=true to enable)');
}

/**
 * Central cache client with standardized methods
 * All cache operations should use this client for consistency
 * Falls back to no-op when Redis is not available
 */
export const cacheClient = {
  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<any|null>} Parsed value or null if not found
   */
  async get(key) {
    if (!redis || !redisEnabled) return null;
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.warn('Cache get error:', err.message);
      return null;
    }
  },

  /**
   * Set value in cache with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache (will be JSON stringified)
   * @param {number} ttlSeconds - Time to live in seconds (default: 60)
   */
  async set(key, value, ttlSeconds = 60) {
    if (!redis || !redisEnabled) return;
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      console.warn('Cache set error:', err.message);
    }
  },

  /**
   * Delete key from cache
   * @param {string} key - Cache key or pattern
   */
  async del(key) {
    if (!redis || !redisEnabled) return;
    try {
      await redis.del(key);
    } catch (err) {
      console.warn('Cache del error:', err.message);
    }
  },

  /**
   * Invalidate cache key (alias for del)
   * @param {string} key - Cache key
   */
  async invalidate(key) {
    return this.del(key);
  },

  /**
   * Delete multiple keys matching a pattern
   * @param {string} pattern - Redis key pattern (e.g., 'student_dashboard_*')
   */
  async delPattern(pattern) {
    if (!redis || !redisEnabled) return;
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      console.warn('Cache delPattern error:', err.message);
    }
  },

  /**
   * Delete multiple patterns at once using registry keys
   * @param {string[]} patterns - Array of registry pattern constants
   * @example cacheClient.delPatterns([REDIS_KEY_REGISTRY.STUDENT_DASHBOARD, REDIS_KEY_REGISTRY.INSTRUCTOR_DASHBOARD])
   */
  async delPatterns(patterns) {
    if (!redis || !redisEnabled) return;
    try {
      const allKeys = [];
      for (const pattern of patterns) {
        const keys = await redis.keys(pattern);
        allKeys.push(...keys);
      }
      if (allKeys.length > 0) {
        await redis.del(...allKeys);
      }
    } catch (err) {
      console.warn('Cache delPatterns error:', err.message);
    }
  },

  /**
   * Check if key exists
   * @param {string} key - Cache key
   * @returns {Promise<boolean>}
   */
  async exists(key) {
    if (!redis || !redisEnabled) return false;
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (err) {
      console.warn('Cache exists error:', err.message);
      return false;
    }
  },

  /**
   * Get remaining TTL for a key
   * @param {string} key - Cache key
   * @returns {Promise<number>} TTL in seconds, -1 if no expire, -2 if key doesn't exist
   */
  async ttl(key) {
    if (!redis || !redisEnabled) return -2;
    try {
      return await redis.ttl(key);
    } catch (err) {
      console.warn('Cache ttl error:', err.message);
      return -2;
    }
  },

  /**
   * Increment a counter
   * @param {string} key - Cache key
   * @param {number} by - Increment amount (default: 1)
   * @returns {Promise<number>} New value after increment
   */
  async incr(key, by = 1) {
    if (!redis || !redisEnabled) return 0;
    try {
      return await redis.incrby(key, by);
    } catch (err) {
      console.warn('Cache incr error:', err.message);
      return 0;
    }
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
