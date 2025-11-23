import { auth } from '../config/firebase.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Auth failed: No Bearer token provided');
      return res.status(401).json({ 
        error: 'Unauthorized - No token provided',
        details: 'Authorization header must be in format: Bearer <token>'
      });
    }

    // Extract token
    const token = authHeader.split('Bearer ')[1];
    
    if (!token || token.trim() === '') {
      console.warn('Auth failed: Empty token');
      return res.status(401).json({ error: 'Unauthorized - Empty token' });
    }

    // Verify token with Firebase
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (verifyError) {
      console.error('Firebase token verification failed:', verifyError.message);
      return res.status(401).json({ 
        error: 'Unauthorized - Invalid token',
        details: verifyError.message
      });
    }

    // Token verified successfully
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      iat: decodedToken.iat,
      exp: decodedToken.exp
    };

    console.log(`Auth successful for user: ${decodedToken.email}`);
    next();
    
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(401).json({ 
      error: 'Unauthorized - Authentication failed',
      details: error.message
    });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!roles.includes(req.user.role || '')) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }
    next();
  };
};