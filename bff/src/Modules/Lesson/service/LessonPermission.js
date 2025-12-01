/**
 * Permission checks for Lesson operations
 */
import { isAdminOrCourseOwner } from '../../../utils/SharedPermission.js';

export const LessonPermission = {
  create: (user, course) => isAdminOrCourseOwner(user, course),
  update: (user, course) => isAdminOrCourseOwner(user, course),
  delete: (user, course) => isAdminOrCourseOwner(user, course),
  read: () => true
};

