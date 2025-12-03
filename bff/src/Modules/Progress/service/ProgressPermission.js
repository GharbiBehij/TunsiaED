/**
 * Permission checks for Progress operations
 */
import { isAdmin, isStudent, isInstructor } from '../../../utils/SharedPermission.js';

export const ProgressPermission = {
  // Students can view their own progress
  viewOwnProgress: (user) => isAdmin(user) || isStudent(user),
  
  // Students can update their own progress
  updateOwnProgress: (user) => isAdmin(user) || isStudent(user),
  
  // Instructors can view progress of students in their courses
  viewStudentProgress: (user) => isAdmin(user) || isInstructor(user),
  
  // Only admins can delete progress
  deleteProgress: (user) => isAdmin(user),
  
  // Check if user can view specific progress
  canViewProgress: (user, progress) => {
    if (isAdmin(user)) return true;
    if (isStudent(user) && progress.userId === user.uid) return true;
    // Instructors need additional course ownership check (done in service layer)
    if (isInstructor(user)) return true;
    return false;
  },
  
  // Check if user can update specific progress
  canUpdateProgress: (user, progress) => {
    if (isAdmin(user)) return true;
    if (isStudent(user) && progress.userId === user.uid) return true;
    return false;
  },
};
