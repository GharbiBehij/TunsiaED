/**
 * Permission checks for Student operations
 */
import { isAdmin, isStudent } from '../../../utils/SharedPermission.js';

export const StudentPermission = {
  getStats: (user) => isAdmin(user) || isStudent(user),
  getCourses: (user) => isAdmin(user) || isStudent(user),
  getEnrollments: (user) => isAdmin(user) || isStudent(user),
  getProgress: (user) => isAdmin(user) || isStudent(user),
  getCertificates: (user) => isAdmin(user) || isStudent(user),
  updateProgress: (user) => isAdmin(user) || isStudent(user),
};

