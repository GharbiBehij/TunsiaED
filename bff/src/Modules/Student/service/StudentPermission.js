/**
 * Permission checks for Student operations
 */
import { isAdmin, isStudent, isSelf } from '../../../utils/SharedPermission.js';

export const StudentPermission = {
  read: (user, targetId) => 
    isAdmin(user) || (isStudent(user) && isSelf(user, targetId)),
  // Students can only access their own data, admins can access all
};

