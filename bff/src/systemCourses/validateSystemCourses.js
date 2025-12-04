// Validator for system courses
// Ensures all required fields exist before seeding

const REQUIRED_COURSE_FIELDS = [
  'courseId',
  'title',
  'description',
  'instructorId',
  'instructorName',
  'category',
  'level',
  'price',
  'duration',
  'isSystemCourse',
];

const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'];
const VALID_CATEGORIES = ['Programming', 'Design', 'Business', 'Marketing'];

/**
 * Validate a single system course object
 * @param {Object} course - Course object to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateSystemCourse(course) {
  const errors = [];

  // Check required fields
  for (const field of REQUIRED_COURSE_FIELDS) {
    if (!(field in course)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate types
  if (typeof course.courseId !== 'string' || !course.courseId) {
    errors.push('courseId must be a non-empty string');
  }

  if (typeof course.title !== 'string' || course.title.length < 5) {
    errors.push('title must be a string with at least 5 characters');
  }

  if (typeof course.description !== 'string' || course.description.length < 20) {
    errors.push('description must be a string with at least 20 characters');
  }

  if (typeof course.price !== 'number' || course.price < 0) {
    errors.push('price must be a non-negative number');
  }

  if (typeof course.duration !== 'number' || course.duration <= 0) {
    errors.push('duration must be a positive number');
  }

  if (!VALID_LEVELS.includes(course.level)) {
    errors.push(`level must be one of: ${VALID_LEVELS.join(', ')}`);
  }

  if (!VALID_CATEGORIES.includes(course.category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (course.isSystemCourse !== true) {
    errors.push('isSystemCourse must be true for system courses');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all system courses
 * @param {Array} courses - Array of course objects
 * @returns {Object} { valid: boolean, errors: Object }
 */
export function validateAllSystemCourses(courses) {
  if (!Array.isArray(courses)) {
    return { valid: false, errors: { general: ['courses must be an array'] } };
  }

  const allErrors = {};
  let allValid = true;

  courses.forEach((course, index) => {
    const result = validateSystemCourse(course);
    if (!result.valid) {
      allValid = false;
      allErrors[`course_${index}_${course.courseId || 'unknown'}`] = result.errors;
    }
  });

  return {
    valid: allValid,
    errors: allErrors,
  };
}
