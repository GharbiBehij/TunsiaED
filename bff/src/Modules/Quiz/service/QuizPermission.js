/**
 * Permission checks for Quiz operations
 */
import { isAdminOrCourseOwner } from '../../../utils/SharedPermission.js';

export function canCreateQuiz(user, course) {
  return isAdminOrCourseOwner(user, course);
}

export function canUpdateQuiz(user, course) {
  return isAdminOrCourseOwner(user, course);
}

export function canDeleteQuiz(user, course) {
  return isAdminOrCourseOwner(user, course);
}

