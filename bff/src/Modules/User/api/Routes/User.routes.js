// bff/src/Modules/User/api/Routes/User.routes.js
import express from 'express';
import { authenticate } from '../../../../middlewares/auth.middleware.js';
import { db } from '../../../../config/firebase.js';
import { userRepository } from '../../repository/User.repository.js';

const router = express.Router();

router.post('/onboard', authenticate, async (req, res) => {
  const { uid, email } = req.user;
  const { name, phone, role } = req.body;

  try {
    // Convert string role to boolean flags
    const profile = await userRepository.onboard(uid, {
      email,
      name,
      phone,
      isAdmin: role === 'admin',      // ← Add these
      isInstructor: role === 'instructor',
      isStudent: role === 'student' || !role,  // Default to student
    });
    res.json({ message: 'Welcome to TunisiaED!', profile });
  } catch (err) {
    console.error('Onboarding error:', err);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  const { uid } = req.user;  // from token

  const userDoc = await db.collection('User').doc(uid).get();
  if (!userDoc.exists) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  const profile = userDoc.data();

  res.json({
    uid,
    email: req.user.email,
    profile: {
      name: profile.name,
      isAdmin: profile.isAdmin || false,
      isInstructor: profile.isInstructor || false,
      isStudent: profile.isStudent !== false,
      // add phone, birthDate, etc.
    }
  });
});

router.patch('/me', authenticate, async (req, res) => {
  const updated = await userRepository.updateProfile(req.user.uid, req.body);
  res.json(updated);
});

router.delete('/me', authenticate, async (req, res) => {
  const deleted = await userRepository.deleteProfile(req.user.uid);
  res.json(deleted);
});

export { router as userRoutes };