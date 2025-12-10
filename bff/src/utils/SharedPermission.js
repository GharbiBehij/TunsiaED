/**
 * Shared permission/ownership logic used across all modules
 * This file contains common ownership checks that are reused across different modules
 */

/**
 * Check if user is an admin (has full access to everything)
 * @param {Object} user - User object
 * @returns {boolean} True if user is admin
 */
export function isAdmin(user) {
  return user?.isAdmin === true;
}
export function isInstructor(user) {
  return user?.isInstructor === true;
}
export function isStudent(user) {
  if (!user) return false;
  return (
    user.isStudent === true ||              // top-level flag
    user.role === 'student' ||              // role field, if you have it
    user.roleFlags?.isStudent === true      // nested flags, if you use them
  );
}
/**
 * Check if user owns a course (is the instructor of the course)
 * @param {Object} user - User object
 * @param {Object} course - Course object with instructorId property
 * @returns {boolean} True if user is the course owner/instructor
 */
export function isCourseOwner(user, course) {
  return course?.instructorId === user?.uid;
}

/**
 * Check if user owns a resource by userId field
 * @param {Object} user - User object
 * @param {Object} resource - Resource object with userId property
 * @returns {boolean} True if user owns the resource
 */
export function isResourceOwner(user, resource) {
  return resource?.userId === user?.uid;
}

/**
 * Check if user owns a resource by comparing user ID with target ID
 * @param {Object} user - User object
 * @param {string} targetId - Target user ID to compare
 * @returns {boolean} True if user ID matches target ID
 */
export function isSelf(user, targetId) {
  return user?.uid === targetId;
}

/**
 * Check if user is admin OR owns a course
 * Common pattern: admin has full access, or user owns the course
 * @param {Object} user - User object
 * @param {Object} course - Course object with instructorId property
 * @returns {boolean} True if user is admin or course owner
 */
export function isAdminOrCourseOwner(user, course) {
  return isAdmin(user) || isCourseOwner(user, course);
}

/**
 * Check if user is admin OR owns a resource
 * Common pattern: admin has full access, or user owns the resource
 * @param {Object} user - User object
 * @param {Object} resource - Resource object with userId property
 * @returns {boolean} True if user is admin or resource owner
 */
export function isAdminOrResourceOwner(user, resource) {
  return isAdmin(user) || isResourceOwner(user, resource);
}

/**
 * Check if user is admin OR is self
 * Common pattern: admin has full access, or user is accessing their own data
 * @param {Object} user - User object
 * @param {string} targetId - Target user ID
 * @returns {boolean} True if user is admin or accessing own data
 */
export function isAdminOrSelf(user, targetId) {
  return isAdmin(user) || isSelf(user, targetId);
}

