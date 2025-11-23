// src/modules/User/api/controllers/User.controller.js
import { userRepository } from '../../repository/User.repository.js';
import { z } from 'zod';

// This schema is the SINGLE SOURCE OF TRUTH for what users can send
const OnboardSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().regex(/^[\d\+\-\s\(\)]+$/).optional(),
  role: z.enum(['student', 'instructor']).default('student'),
  
  // ADD ALL YOUR EXTRA FIELDS HERE — forever
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),        // "1998-05-20"
  birthPlace: z.string().min(2).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  bio: z.string().max(500).optional(),
  // add linkedin, github, photoURL, etc. later → just add here
});

export const onboardUser = async (req, res) => {
  const { uid, email } = req.user; // ← 100% trusted from Firebase token

  const parsed = OnboardSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid data',
      details: parsed.error.format(),
    });
  }

  try {
    const profile = await userRepository.onboard(uid, {
      email,
      ...parsed.data,
    });

    return res.json({
      message: 'Welcome to TunisiaED!',
      profile,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save profile' });
  }
};

export const getMyProfile = async (req, res) => {
  const profile = await userRepository.findByUid(req.user.uid);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  res.json(profile);
}; 