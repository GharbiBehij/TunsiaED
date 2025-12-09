import { auth } from '../config/firebase.js';
import { userService } from '../Modules/User/service/User.service.js';

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

    // Get user profile from database to ensure we have the latest role information
    let userProfile;
    try {
      userProfile = await userService.getProfile(decodedToken.uid);
    } catch (profileError) {
      console.error('Failed to fetch user profile:', profileError.message);
      // If profile doesn't exist, create basic user object from token
      userProfile = null;
    }

    // Set user context with token data and profile data
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      // Use profile data if available, otherwise fall back to token claims
      isAdmin: userProfile?.isAdmin ?? decodedToken.isAdmin ?? false,
      isInstructor: userProfile?.isInstructor ?? decodedToken.isInstructor ?? false,
      isStudent: userProfile?.isStudent ?? decodedToken.isStudent ?? false,
      // Include profile data for additional context
      profile: userProfile,
    };

    console.log(`Auth successful for user: ${decodedToken.email} (Role: ${req.user.isAdmin ? 'admin' : req.user.isInstructor ? 'instructor' : 'student'})`);
    next();

  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(401).json({
      error: 'Unauthorized - Authentication failed',
      details: error.message
    });
  }
};
