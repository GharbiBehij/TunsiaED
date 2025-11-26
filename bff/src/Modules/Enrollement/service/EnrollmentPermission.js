/**
 * Permission checks for Enrollment operations
 */
import { isAdminOrCourseOwner } from '../../../utils/SharedPermission.js';

export function canViewCourseStudents(user, course) {
  return isAdminOrCourseOwner(user, course);
}

