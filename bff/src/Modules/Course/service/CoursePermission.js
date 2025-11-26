/**
 * Permission checks for Course operations
 */
import { isAdmin, isAdminOrCourseOwner } from '../../../utils/SharedPermission.js';

export function canCreateCourse(user) {
  return user?.isInstructor === true || isAdmin(user);
}

export function canUpdateCourse(user, course) {
  return isAdminOrCourseOwner(user, course);
}

export function canDeleteCourse(user, course) {
  return isAdminOrCourseOwner(user, course);
}

