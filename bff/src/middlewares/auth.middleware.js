import { auth } from '../config/firebase.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    //check data ,if the header does not have a bearer->Unauthorized access
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }
//else if there a bearer header assigned, we can proceed to verify in the token assigned
// verfication happens with the verifyIdtoken by firebase 
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
//through the decoding , we will check the id,email
    // Note: role is stored in Firestore profile, not in Firebase token
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };

    next();//you can pass (succes)
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
//in case of any error , return a 401 error of Unauthorization 
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