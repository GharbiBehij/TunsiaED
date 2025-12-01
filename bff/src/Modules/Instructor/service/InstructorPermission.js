/**
 * Permission checks for Instructor operations
 */
import { isAdmin, isInstructor, isSelf } from '../../../utils/SharedPermission.js';

export const InstructorPermission = {
  read: (user, targetId) => 
    isAdmin(user) || (isInstructor(user) && isSelf(user, targetId)),
  // Instructors can only access their own data, admins can access all
};

