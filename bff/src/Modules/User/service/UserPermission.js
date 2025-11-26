/**
 * Permission checks for User operations
 */
import { isAdmin, isAdminOrSelf } from '../../../utils/SharedPermission.js';

export function canUpdateProfile(user, targetUserId) {
  // Users can update their own profile, admins can update any profile
  return isAdminOrSelf(user, targetUserId);
}

export function canDeleteProfile(user, targetUserId) {
  // Users can delete their own profile, admins can delete any profile
  return isAdminOrSelf(user, targetUserId);
}

export function canUpdateRole(user, targetUser, newRole) {
  // Only admins can change roles
  if (!isAdmin(user)) {
    return false;
  }

  // Admins cannot change their own admin status (safety check)
  if (targetUser?.isAdmin === true && user?.uid === targetUser?.uid) {
    return false;
  }

  // Admins can change any role
  return true;
}

export function canViewAllUsers(user) {
  // Only admins can view all users
  return isAdmin(user);
}

