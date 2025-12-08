// Student Dashboard Orchestrator
// Orchestrates cross-module data for student dashboard
import { StudentPermission } from '../Modules/Student/service/StudentPermission.js';
import { studentService } from '../Modules/Student/service/Student.service.js';
import { progressService } from '../Modules/Progress/service/Progress.service.js';
import { enrollmentService } from '../Modules/Enrollement/service/Enrollement.service.js';
import { certificateService } from '../Modules/Certificate/service/Certificate.service.js';
import { cacheClient } from '../core/cache/cacheClient.js';

export class StudentDashboardOrchestrator {
  // ====================================================================
  // DASHBOARD OPERATIONS
  // ====================================================================

  /**
   * Get complete student dashboard data
   * @param {Object} user - Authenticated user
   * @returns {Object} Dashboard DTO
   */
  async getDashboardData(user) {
    console.log('📊 [StudentDash] getDashboardData called:', user.uid);
    const cacheKey = `student_dashboard_${user.uid}`;
    
    // 1. Validate permissions
    console.log('🔐 [StudentDash] Validating permissions...');
    if (!StudentPermission.getStats(user)) {
      console.error('⛔ [StudentDash] Unauthorized');
      throw new Error('Unauthorized');
    }
    console.log('✅ [StudentDash] Permissions validated');

    // 2. Read cache (optional)
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 3. Call services (pure business logic)
    const [stats, courses] = await Promise.all([
      studentService.getStats(user),
      studentService.getCourses(user),
    ]);

    // 4. Build result DTO
    const result = {
      stats,
      courses,
    };

    // 5. Update Redis cache
    await cacheClient.set(cacheKey, result, 300); // 5 min cache

    // 6. Return final aggregated response
    return result;
  }

  /**
   * Get student enrollments with progress details
   * Cross-module: Student + Enrollment + Progress
   * @param {Object} user - Authenticated user
   * @returns {Object} Enrollments DTO
   */
  async getEnrollmentsWithProgress(user) {
    // 1. Check permission
    if (!StudentPermission.getEnrollments(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Fetch enrollments and progress from services
    const [enrollments, progressList] = await Promise.all([
      studentService.getEnrollments(user),
      progressService.getProgressByUserInternal(user.uid),
    ]);

    // 3. Create progress map for quick lookup
    const progressMap = new Map();
    progressList.forEach(progress => {
      if (progress.moduleType === 'course') {
        progressMap.set(progress.moduleId, progress);
      }
    });

    // 4. Merge enrollments with progress
    const enrichedEnrollments = enrollments.map(enrollment => {
      const progress = progressMap.get(enrollment.courseId);
      return {
        ...enrollment,
        progressDetails: progress || null,
        completedItems: progress?.completedItems || [],
        totalItems: progress?.totalItems || 0,
      };
    });

    // 5. Return clean DTO
    return {
      enrollments: enrichedEnrollments,
    };
  }

  /**
   * Get student certificates
   * @param {Object} user - Authenticated user
   * @returns {Object} Certificates DTO
   */
  async getCertificates(user) {
    // 1. Check permission
    if (!StudentPermission.getCertificates(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Fetch certificates from certificate module
    const certificates = await certificateService.getUserCertificates(user.uid);

    // 3. Return clean DTO
    return {
      certificates,
    };
  }

  /**
   * Get student learning overview (stats + recent progress)
   * Cross-module: Student + Progress + Certificate
   * @param {Object} user - Authenticated user
   * @returns {Object} Learning overview DTO
   */
  async getLearningOverview(user) {
    const cacheKey = `student_learning_overview_${user.uid}`;
    
    // 1. Validate permissions
    if (!StudentPermission.getStats(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Read cache (optional)
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 3. Call services (pure business logic)
    const [stats, progressList, certificates] = await Promise.all([
      studentService.getStats(user),
      progressService.getProgressByUserInternal(user.uid),
      certificateService.getUserCertificates(user.uid),
    ]);

    // Calculate additional metrics
    const inProgressCourses = progressList.filter(
      p => p.moduleType === 'course' && !p.completed && p.progress > 0
    );

    const completedCourses = progressList.filter(
      p => p.moduleType === 'course' && p.completed
    );

    // 4. Build result DTO
    const result = {
      stats,
      inProgressCourses: inProgressCourses.length,
      completedCourses: completedCourses.length,
      certificatesEarned: certificates.length,
      recentProgress: progressList
        .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt))
        .slice(0, 5),
    };

    // 5. Update Redis cache
    await cacheClient.set(cacheKey, result, 300); // 5 min cache

    // 6. Return final aggregated response
    return result;
  }

  // ====================================================================
  // CROSS-MODULE PROGRESS OPERATIONS (Student + Progress + Enrollment)
  // ====================================================================

  /**
   * Get student's learning progress
   * Cross-module: Student + Progress
   * @param {Object} user - Authenticated user
   * @returns {Object[]} Array of progress DTOs
   */
  async getProgress(user) {
    // 1. Check permission
    if (!StudentPermission.getProgress(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Get all progress records for this user (Progress service - internal)
    return await progressService.getProgressByUserInternal(user.uid);
  }

  /**
   * Update student's course progress
   * Cross-module: Student + Progress + Enrollment
   * @param {Object} user - Authenticated user
   * @param {string} enrollmentId - Enrollment ID
   * @param {string} courseId - Course ID
   * @param {number} progressValue - Progress value (0-100)
   * @returns {Object} Updated progress DTO
   */
  async updateProgress(user, enrollmentId, courseId, progressValue) {
    // 1. Check permission
    if (!StudentPermission.updateProgress(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Validate progress value
    if (progressValue < 0 || progressValue > 100) {
      throw new Error('Invalid progress value');
    }

    // 3. Verify enrollment belongs to user (Enrollment service)
    const enrollment = await enrollmentService.getEnrollmentByIdInternal(enrollmentId);
    if (!enrollment || enrollment.userId !== user.uid) {
      throw new Error('Enrollment not found');
    }

    // 4. Get or create progress record (Progress service)
    const progress = await progressService.getOrCreateProgressInternal(
      enrollmentId,
      'course',
      courseId,
      user.uid
    );

    // 5. Update the progress value (Progress service)
    const updated = await progressService.updateProgressInternal(progress.progressId, {
      progress: progressValue,
    });

    // 6. Also update enrollment for backward compatibility
    await enrollmentService.updateEnrollmentProgressInternal(enrollmentId, {
      progress: progressValue,
    });

    // 7. Return clean DTO
    return {
      progressId: updated.progressId,
      enrollmentId,
      courseId,
      progress: updated.progress,
      completed: updated.completed,
      lastAccessedAt: updated.lastAccessedAt,
    };
  }

  /**
   * Mark a lesson as completed and update progress
   * Cross-module: Student + Progress + Enrollment
   * @param {Object} user - Authenticated user
   * @param {string} enrollmentId - Enrollment ID
   * @param {string} lessonId - Lesson ID to mark complete
   * @param {string} courseId - Course ID
   * @param {number} totalLessons - Total lessons in course
   * @returns {Object} Progress result DTO
   */
  async completeLesson(user, enrollmentId, lessonId, courseId, totalLessons) {
    // 1. Check permission
    if (!StudentPermission.updateProgress(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Get enrollment to verify ownership (Enrollment service)
    const enrollment = await enrollmentService.getEnrollmentByIdInternal(enrollmentId);
    if (!enrollment || enrollment.userId !== user.uid) {
      throw new Error('Enrollment not found');
    }

    // 3. Get or create progress record for the course (Progress service)
    const progress = await progressService.getOrCreateProgressInternal(
      enrollmentId,
      'course',
      courseId,
      user.uid,
      totalLessons || 1
    );

    // 4. Mark the lesson item as completed (Progress service)
    const updated = await progressService.markItemCompletedInternal(progress.progressId, lessonId);

    // 5. If course is completed, mark enrollment as completed (Enrollment service)
    if (updated.completed) {
      await enrollmentService.markEnrollmentAsCompletedInternal(enrollmentId);
    }

    // 6. Return clean DTO
    return {
      progressId: updated.progressId,
      progress: updated.progress,
      completedLessons: updated.completedItems,
      totalLessons: updated.totalItems,
      completed: updated.completed,
      completedAt: updated.completedAt,
    };
  }
}

export const studentDashboardOrchestrator = new StudentDashboardOrchestrator();
