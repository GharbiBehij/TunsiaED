/**
 * Permission checks for Lesson operations
 */
import { isAdminOrCourseOwner } from '../../../utils/SharedPermission.js';

export function canCreateLesson(user, course) {
  return isAdminOrCourseOwner(user, course);
}

export function canUpdateLesson(user, course) {
  return isAdminOrCourseOwner(user, course);
}

export function canDeleteLesson(user, course) {
  return isAdminOrCourseOwner(user, course);
}

