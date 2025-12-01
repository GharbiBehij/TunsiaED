/**
 * Permission checks for Quiz operations
 */
import { isAdminOrCourseOwner } from '../../../utils/SharedPermission.js';

export const QuizPermission = {
  create: (user, course) => isAdminOrCourseOwner(user, course),
  update: (user, course) => isAdminOrCourseOwner(user, course),
  delete: (user, course) => isAdminOrCourseOwner(user, course),
  read: () => true
};

