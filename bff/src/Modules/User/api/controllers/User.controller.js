import * as userService from '../services/User.service.js';
import { OnboardSchema } from '../Validators/User.schema.js';
import { userRepository } from '../../repository/User.repository.js';

export const onboardUser = async (req, res) => {
  const parsed = OnboardSchema.safeParse(req.body);
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

export const getMyProfile = async (req, res) => {
  try {
    const profile = await userService.getMyProfile(req.user.uid);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    const updated = await userService.updateProfile(userId, user, req.body);
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

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    
    await userService.deleteProfile(userId, user);
    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};
