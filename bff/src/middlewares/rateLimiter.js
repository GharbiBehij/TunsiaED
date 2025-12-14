// Rate Limiter Middleware
// Protects against DOS attacks and brute force attempts

/**
 * Create rate limiters for different endpoint types
 * Uses in-memory store for simplicity (can upgrade to Redis for distributed systems)
 */
export function createRateLimiters() {
  // Simple in-memory rate limiter
  const createLimiter = (windowMs, max, message) => {
    const requests = new Map();

    return (req, res, next) => {
      const key = req.ip || req.connection.remoteAddress;
      const now = Date.now();
      
      // Clean old entries
      if (requests.has(key)) {
        const userRequests = requests.get(key).filter(time => now - time < windowMs);
        requests.set(key, userRequests);
        
        if (userRequests.length >= max) {
          return res.status(429).json({
            error: 'Too many requests',
            message,
            retryAfter: Math.ceil((userRequests[0] + windowMs - now) / 1000)
          });
        }
        
        userRequests.push(now);
      } else {
        requests.set(key, [now]);
      }
      
      next();
    };
  };

  return {
    // Payment endpoints - strict limiting
    payment: createLimiter(
      15 * 60 * 1000, // 15 minutes
      10, // 10 requests
      'Too many payment requests. Please try again in 15 minutes.'
    ),
    
    // Enrollment endpoints - moderate limiting
    enrollment: createLimiter(
      10 * 60 * 1000, // 10 minutes
      20, // 20 requests
      'Too many enrollment requests. Please try again in 10 minutes.'
    ),
    
    // General API endpoints - relaxed limiting
    general: createLimiter(
      1 * 60 * 1000, // 1 minute
      100, // 100 requests
      'Too many requests. Please slow down.'
    )
  };
}
