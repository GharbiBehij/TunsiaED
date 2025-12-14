// Enrollment Orchestrator
// Orchestrates cross-module operations between Enrollment, Progress, User, and Course modules
// Uses SERVICES (not repositories) - mappers are applied in service layer

import { userService } from '../Modules/User/service/User.service.js';
import { courseService } from '../Modules/Course/service/Course.service.js';
import { enrollmentService } from '../Modules/Enrollement/service/Enrollement.service.js';
import { progressService } from '../Modules/Progress/service/Progress.service.js';
import { EnrollmentPermission } from '../Modules/Enrollement/service/EnrollmentPermission.js';
import { cacheClient, REDIS_KEY_REGISTRY } from '../core/cache/cacheClient.js';

/**
 * Permission check: Can user view course students?
 */
function canViewCourseStudents(user, course) {
  if (user.isAdmin) return true;
  if (user.isInstructor && course.instructorId === user.uid) return true;
  return false;
}

export class EnrollmentOrchestrator {
  // ====================================================================
  // ENROLLMENT OPERATIONS (Enrollment + Course + Progress)
  // ====================================================================

  /**
   * Enroll user in a course
   * Cross-module: Enrollment + Course + Progress
   * @param {string} userId - User ID
   * @param {Object} data - { courseId, paymentId? }
   */
  async enroll(userId, data) {
    console.log('📋 [EnrollmentOrch] enroll called:', {
      userId,
      courseId: data.courseId,
      paymentId: data.paymentId
    });

    // 1. Check if user is already enrolled (Enrollment service)
    console.log('🔍 [EnrollmentOrch] Checking enrollment status...');
    const alreadyEnrolled = await enrollmentService.checkUserEnrollment(userId, data.courseId);
    if (alreadyEnrolled) {
      console.error('⛔ [EnrollmentOrch] User already enrolled');
      throw new Error('You are already enrolled in this course');
    }
    console.log('✅ [EnrollmentOrch] No existing enrollment found');

    // 2. Validate course exists and is published (Course service - returns mapped model)
    console.log('🔍 [EnrollmentOrch] Validating course...');
    const course = await courseService.getCourseById(data.courseId);
    if (!course) {
      console.error('❌ [EnrollmentOrch] Course not found:', data.courseId);
      throw new Error('Course not found');
    }
    if (course.isPublished === false) {
      console.error('⛔ [EnrollmentOrch] Course not published');
      throw new Error('This course is not available yet');
    }
    console.log('✅ [EnrollmentOrch] Course validated:', course.title);
    if (course.price > 0 && !data.paymentId) {
      throw new Error('Payment required for this course');
    }

    // 3. Create enrollment (Enrollment service - returns mapped model)
    const enrollment = await enrollmentService.createEnrollment(userId, {
      courseId: data.courseId,
      courseTitle: course.title,
      instructorId: course.instructorId,
      pricePaid: course.price,
      enrolledAt: new Date(),
      progress: 0,
      completed: false,
    });

    // 4. Create initial Progress record (Progress service)
    try {
      await progressService.createProgressInternal({
        enrollmentId: enrollment.enrollmentId,
        moduleType: 'course',
        moduleId: data.courseId,
        userId: userId,
        progress: 0,
        completedItems: [],
        totalItems: 0,
        completed: false,
      });
    } catch (progressError) {
      console.error('Failed to create progress record:', progressError);
      // Don't fail enrollment if progress creation fails
    }

    // 5. Invalidate affected cache keys
    console.log('🗑️ [EnrollmentOrch] Invalidating cache keys for enrollment creation...');
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.STUDENT_DASHBOARD);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.ENROLLMENTS);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.COURSE_ENROLLMENTS);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.STUDENT_LEARNING_OVERVIEW);

    return enrollment;
  }

  /**
   * Get students enrolled in a course (for instructors)
   * Cross-module: Enrollment + Course
   * @param {string} courseId - Course ID
   * @param {Object} user - Authenticated user
   */
  async getStudentsForCourse(courseId, user) {
    // 1. Validate course exists (Course service - returns mapped model)
    const course = await courseService.getCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // 2. Check permission
    if (!EnrollmentPermission.read(user, course)) {
      throw new Error('Unauthorized');
    }

    // 3. Get enrollments (Enrollment service - returns mapped models)
    return await enrollmentService.getCourseEnrollments(courseId);
  }

  // ====================================================================
  // PROGRESS OPERATIONS (Enrollment + Progress)
  // ====================================================================

  /**
   * Update enrollment progress
   * Cross-module: Enrollment + Progress
   * @param {string} enrollmentId - Enrollment ID
   * @param {Object} progressData - Progress data
   */
  async updateEnrollmentProgress(enrollmentId, progressData) {
    // 1. Get enrollment (Enrollment service - returns mapped model)
    const enrollment = await enrollmentService.getEnrollmentById(enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    // 2. Get or create progress record (Progress service - returns mapped model)
    const progress = await progressService.getOrCreateProgressInternal(
      enrollment.enrollmentId,
      'course',
      enrollment.courseId,
      enrollment.userId
    );

    // 3. Update progress (Progress service - returns mapped model)
    const updatedProgress = await progressService.updateProgressInternal(
      progress.progressId,
      progressData
    );

    // 4. Sync to enrollment for backward compatibility (Enrollment service)
    await enrollmentService.updateEnrollmentProgress(enrollmentId, {
      progress: updatedProgress.progress,
      completed: updatedProgress.completed,
    });

    return updatedProgress;
  }

  /**
   * Get enrollment with detailed progress
   * Cross-module: Enrollment + Progress
   * @param {string} enrollmentId - Enrollment ID
   */
  async getEnrollmentWithProgress(enrollmentId) {
    // 1. Get enrollment (Enrollment service - returns mapped model)
    const enrollment = await enrollmentService.getEnrollmentById(enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    // 2. Get progress records (Progress service - returns mapped models)
    const progressRecords = await progressService.getProgressByEnrollmentInternal(enrollmentId);
    const courseProgress = progressRecords.find(p => p.moduleType === 'course');

    // 3. Return enriched DTO
    return {
      ...enrollment,
      progressDetails: {
        overall: courseProgress || null,
        byModule: progressRecords.filter(p => p.moduleType !== 'course'),
      },
    };
  }

  // ====================================================================
  // INSTRUCTOR VIEW OPERATIONS (Enrollment + Progress + User + Course)
  // ====================================================================

  /**
   * Get course enrollments with progress (for instructors to track student progress)
   * Cross-module: Enrollment + Progress + User + Course
   */
  async getCourseEnrollmentsWithProgress(courseId, user) {
    const cacheKey = `course_enrollments_progress_${courseId}`;
    
    // Check cache first
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 1. Validate course exists (Course service - returns mapped model)
    const course = await courseService.getCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // 2. Check permission
    if (!canViewCourseStudents(user, course)) {
      throw new Error('Unauthorized');
    }

    // 3. Fetch enrollments and progress in parallel (Services - return mapped models)
    const [enrollments, progressRecords] = await Promise.all([
      enrollmentService.getCourseEnrollments(courseId),
      progressService.getProgressByModuleInternal('course', courseId),
    ]);

    // 4. Create progress map for O(1) lookup
    const progressMap = new Map(
      progressRecords.map(p => [p.userId, p])
    );

    // 5. Batch fetch users (User service - returns mapped models)
    const userIds = [...new Set(enrollments.map(e => e.userId))];
    const users = await userService.getUsersByUidsInternal(userIds);
    const userMap = new Map(users.map(u => [u.uid, u]));

    // 6. Enrich enrollments with progress and user data
    const enrichedEnrollments = enrollments.map(enrollment => {
      const student = userMap.get(enrollment.userId);
      const progress = progressMap.get(enrollment.userId);

      return {
        enrollmentId: enrollment.enrollmentId,
        courseId: enrollment.courseId,
        userId: enrollment.userId,
        enrolledAt: enrollment.enrollmentDate,
        // Student info
        studentName: student?.name || 'Unknown Student',
        studentEmail: student?.email || '',
        studentAvatar: student?.avatar || null,
        // Progress info from Progress module
        progress: progress?.progress || enrollment.progress || 0,
        completedItems: progress?.completedItems || [],
        totalItems: progress?.totalItems || 0,
        completed: progress?.completed || enrollment.completed || false,
        lastAccessedAt: progress?.lastAccessedAt || enrollment.enrollmentDate,
        startedAt: progress?.startedAt || enrollment.enrollmentDate,
        completedAt: progress?.completedAt || null,
      };
    });

    // 7. Return sorted by most recent enrollment
    const result = enrichedEnrollments.sort(
      (a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt)
    );

    // 8. Cache result
    await cacheClient.set(cacheKey, result, 300); // 5 min cache

    return result;
  }

  /**
   * Get course enrollment summary stats
   * Cross-module: Enrollment + Progress
   * @param {string} courseId - The course ID
   * @param {Object} user - The authenticated user
   * @returns {Object} Summary stats DTO
   */
  async getCourseEnrollmentStats(courseId, user) {
    const cacheKey = `course_enrollment_stats_${courseId}`;
    
    // Check cache first
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }

    const enrollmentsWithProgress = await this.getCourseEnrollmentsWithProgress(courseId, user);

    const totalStudents = enrollmentsWithProgress.length;
    const completedCount = enrollmentsWithProgress.filter(e => e.completed).length;
    const inProgressCount = enrollmentsWithProgress.filter(e => e.progress > 0 && !e.completed).length;
    const notStartedCount = enrollmentsWithProgress.filter(e => e.progress === 0).length;
    const averageProgress = totalStudents > 0
      ? Math.round(enrollmentsWithProgress.reduce((sum, e) => sum + e.progress, 0) / totalStudents)
      : 0;

    const result = {
      totalStudents,
      completedCount,
      inProgressCount,
      notStartedCount,
      averageProgress,
      completionRate: totalStudents > 0 
        ? Math.round((completedCount / totalStudents) * 100) 
        : 0,
    };

    // Cache result
    await cacheClient.set(cacheKey, result, 300); // 5 min cache

    return result;
  }
}

export const enrollmentOrchestrator = new EnrollmentOrchestrator();
