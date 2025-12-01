import { userRepository } from '../../repository/User.repository.js';
import { canUpdateProfile, canDeleteProfile, canUpdateRole } from './UserPermission.js';

const ADMIN_EMAIL = "admin@tunisiaed.com";

export const onboardUser = async (user, parsedData) => {
  const { uid, email } = user;

  // ADMIN LOGIC
  const isAdmin = email === ADMIN_EMAIL;// compare the admin email with the firebase email and if they are the same 
  // you pass it to the repo.

  // Role flags (student/instructor) are mapped to booleans
  const roleFlags = {
    isInstructor: parsedData.role === 'instructor',
    isStudent: parsedData.role === 'student' || !parsedData.role,
  };

  return userRepository.onboard(uid, {
    email,
    isAdmin,
    ...roleFlags,//boolean for the roles 
    ...parsedData
  });
};

export const getMyProfile = async (uid) => {
  return userRepository.findByUid(uid); // No need to pass isAdmin
};

export const updateProfile = async (targetUserId, user, updates) => {
  // Check if user can update this profile
  if (!UserPermission.update(user, targetUserId)) {
    throw new Error('Unauthorized');
  }

  // If role-related fields are being updated, check permissions
  const hasRoleUpdate = updates.role || 
                        updates.isAdmin !== undefined || 
                        updates.isInstructor !== undefined || 
                        updates.isStudent !== undefined;

  if (hasRoleUpdate) {
    const targetUser = await userRepository.findByUid(targetUserId);
    if (!targetUser) {
      throw new Error('User not found');
    }

    // Check if user can update roles
    if (!UserPermission.update(user, targetUser, updates.role)) {
      throw new Error('Unauthorized: Only admins can change roles');
    }
  }

  return userRepository.updateProfile(targetUserId, updates);
};

export const deleteProfile = async (targetUserId, user) => {
  // Check if user can delete this profile
  if (!UserPermission.delete(user, targetUserId)) {
    throw new Error('Unauthorized');
  }

  return userRepository.deleteProfile(targetUserId);
};
