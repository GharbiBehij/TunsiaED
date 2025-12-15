// bff/src/Modules/User/api/controllers/User.controller.js
import { userService } from '../../service/User.service.js';
import { OnboardUserSchema, UpdateUserSchema } from '../../Validators/User.schema.js';
import { userRepository } from '../../repository/User.repository.js';
import { FirebaseAuthAdapter } from '../../../adapters/firebaseAdapter.js';
import { mapFirebaseUserToSafeUser } from '../../../utils/FirebaseUserMapper.js';

// Create new user profile during registration
export const onboardUser = async (req, res) => {
  const parsed = OnboardUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid data", details: parsed.error.format() });
  }

  try {
    const profile = await userService.onboardUser(req.user, parsed.data);

    return res.json({ message: "Welcome!", profile });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get authenticated user's profile
export const getMyProfile = async (req, res) => {
  try {
    const profile = await userService.getProfile(req.user.uid);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user profile (admin/self only)
export const updateProfile = async (req, res) => {
  const parsed = UpdateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid data", details: parsed.error.format() });
  }

  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    const updated = await userService.updateProfile(userId, user, parsed.data);
    if (!updated) {
      return res.status(404).json({ error: "Update failed" });
    }
    res.json({ message: "Profile updated successfully", profile: updated });
  } catch (err) {
    if (err.message === 'Unauthorized' || err.message.includes('Unauthorized')) {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// Delete user profile (admin/self only)
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    await userService.deleteProfile(userId);
    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// Get safe Firebase user info (admin only - for debugging/user management)
export const getFirebaseUserInfo = async (req, res) => {
  try {
    const targetUserId = req.params.userId;

    // Only admins can access Firebase user info
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Call Firebase Admin SDK directly (only on backend)
    const rawFirebaseUser = await FirebaseAuthAdapter.getUserByUid(targetUserId);

    // Log raw user object for debugging (contains sensitive data)
    console.log('Raw Firebase user object (sensitive - not sent to client):', {
      uid: rawFirebaseUser.uid,
      email: rawFirebaseUser.email,
      hasPasswordHash: !!rawFirebaseUser.passwordHash,
      hasLastLoginAt: !!rawFirebaseUser.lastLoginAt,
      hasValidSince: !!rawFirebaseUser.validSince,
      providerUserInfoCount: rawFirebaseUser.providerUserInfo?.length || 0,
    });

    // Map to safe DTO
    const safeUser = mapFirebaseUserToSafeUser(rawFirebaseUser);

    // Log safe user object (what's sent to client)
    console.log('Safe user object sent to client:', safeUser);
    console.log('Safe user response keys:', Object.keys(safeUser));

    // Return only safe fields
    res.json(safeUser);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: err.message });
  }
};
