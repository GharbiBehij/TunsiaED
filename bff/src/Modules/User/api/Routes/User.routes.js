// src/modules/User/api/routes/user.routes.js
import express from 'express';
import { authenticate } from '../../../../middlewares/auth.middleware.js';
import { userRepository } from '../../repository/User.repository.js';

const router = express.Router();

router.post('/onboard', authenticate, async (req, res) => {
  const { uid, email } = req.user;
  const { name, phone, role } = req.body;

  try {
    const profile = await userRepository.onboard(uid, {
      email,
      name,
      phone,
      role,
    });
    res.json({ message: 'Welcome to TunisiaED!', profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  const user = await userRepository.findByUid(req.user.uid);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
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