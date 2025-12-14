/**
 * Permission checks for Enrollment operations
 */
import { isAdminOrCourseOwner } from '../../../utils/SharedPermission.js';

export const EnrollmentPermission = {
  read: (user, course) => isAdminOrCourseOwner(user, course),
  // No create/update/delete for enrollments; add as needed.
};

