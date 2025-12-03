/**
 * Permission checks for Instructor operations
 */
import { isAdmin, isInstructor } from '../../../utils/SharedPermission.js';

export const InstructorPermission = {
  getStats: (user) => isAdmin(user) || isInstructor(user),
  getCourses: (user) => isAdmin(user) || isInstructor(user),
  getStudents: (user) => isAdmin(user) || isInstructor(user),
  getRevenue: (user) => isAdmin(user) || isInstructor(user),
  getActivity: (user) => isAdmin(user) || isInstructor(user),
};

