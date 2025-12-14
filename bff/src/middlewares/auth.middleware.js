// bff/src/middlewares/auth.middleware.js
import { auth } from '../config/firebase.js';
import { userService } from '../Modules/User/service/User.service.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized - No token provided',
        details: 'Authorization header must be in format: Bearer <token>'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token || token.trim() === '') {
      return res.status(401).json({ error: 'Unauthorized - Empty token' });
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (verifyError) {
      return res.status(401).json({
        error: 'Unauthorized - Invalid token',
        details: verifyError.message
      });
    }

    let userProfile;
    try {
      userProfile = await userService.getProfile(decodedToken.uid);
    } catch {
      userProfile = null;
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      isAdmin: decodedToken.isAdmin === true || userProfile?.isAdmin === true,
      isInstructor: decodedToken.isInstructor === true || userProfile?.isInstructor === true,
      isStudent: decodedToken.isStudent === true || userProfile?.isStudent === true,
      role: userProfile?.role || (decodedToken.isAdmin ? 'admin' : decodedToken.isInstructor ? 'instructor' : 'student'),
      status: userProfile?.status || 'active',
      profile: userProfile,
    };

    console.log(
      `Auth successful for user: ${decodedToken.email} (Role: ${req.user.role})`
    );
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(401).json({
      error: 'Unauthorized - Authentication failed',
      details: error.message
    });
  }
};
