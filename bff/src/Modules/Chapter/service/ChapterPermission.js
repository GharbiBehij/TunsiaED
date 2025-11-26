/**
 * Permission checks for Chapter operations
 */
import { isAdminOrCourseOwner } from '../../../utils/SharedPermission.js';

export function canCreateChapter(user, course) {
  return isAdminOrCourseOwner(user, course);
}

export function canUpdateChapter(user, course) {
  return isAdminOrCourseOwner(user, course);
}

export function canDeleteChapter(user, course) {
  return isAdminOrCourseOwner(user, course);
}

