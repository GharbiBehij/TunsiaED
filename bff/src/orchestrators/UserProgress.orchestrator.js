// User Progress Orchestrator
// Orchestrates progress tracking across modules
import { ProgressPermission } from '../Modules/Progress/service/ProgressPermission.js';
import { progressService } from '../Modules/Progress/service/Progress.service.js';
import { enrollmentService } from '../Modules/Enrollement/service/Enrollement.service.js';
import { courseService } from '../Modules/Course/service/Course.service.js';
import { cacheClient, REDIS_KEY_REGISTRY } from '../core/cache/cacheClient.js';

export class UserProgressOrchestrator {
  /**
   * Update user progress for a course
   * @param {Object} user - Authenticated user
   * @param {Object} progressData - { enrollmentId, courseId, progress, itemId, totalItems }
   * @returns {Object} Progress DTO
   */
  async updateProgress(user, progressData) {
    const cacheKey = REDIS_KEY_REGISTRY.USER_PROGRESS(user.uid, progressData.courseId);
    
    // 1. Validate permissions
    if (!ProgressPermission.viewOwnProgress(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Validate enrollment belongs to user (Enrollment service)
    const enrollment = await enrollmentService.getEnrollmentById(progressData.enrollmentId);
    if (!enrollment || enrollment.userId !== user.uid) {
      throw new Error('Enrollment not found or unauthorized');
    }

    // 3. Call services (pure business logic)
    // Get or create progress record
    const progress = await progressService.getOrCreateProgress(user, {
      enrollmentId: progressData.enrollmentId,
      moduleType: 'course',
      moduleId: progressData.courseId,
      totalItems: progressData.totalItems || 0,
    });

    // Update progress
    let updatedProgress;
    if (progressData.itemId) {
      // Mark specific item as completed
      updatedProgress = await progressService.markItemCompleted(
        user,
        progress.progressId,
        progressData.itemId
      );
    } else if (progressData.progress !== undefined) {
      // Update overall progress percentage
      updatedProgress = await progressService.updateProgress(
        user,
        progress.progressId,
        { progress: progressData.progress }
      );
    } else {
      throw new Error('Either itemId or progress value must be provided');
    }

    // Sync enrollment progress for backward compatibility
    await enrollmentService.updateEnrollmentProgress(progressData.enrollmentId, {
      progress: updatedProgress.progress,
      completed: updatedProgress.completed,
    });

    // 4. Build result DTO
    const result = {
      progressId: updatedProgress.progressId,
      progress: updatedProgress.progress,
      completedItems: updatedProgress.completedItems,
      totalItems: updatedProgress.totalItems,
      completed: updatedProgress.completed,
      lastAccessedAt: updatedProgress.lastAccessedAt,
    };

    // 5. Invalidate affected cache keys
    console.log('🗑️ [Orchestrator] Invalidating cache keys for progress update...');
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.STUDENT_DASHBOARD);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.INSTRUCTOR_DASHBOARD);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.USER_PROGRESS);

    // 6. Return final aggregated response
    return result;
  }

  /**
   * Get progress by enrollment
   * @param {Object} user - Authenticated user
   * @param {string} enrollmentId - Enrollment ID
   * @returns {Object} Progress DTO
   */
  async getProgressByEnrollment(user, enrollmentId) {
    const cacheKey = REDIS_KEY_REGISTRY.USER_PROGRESS_BY_ENROLLMENT(user.uid, enrollmentId);
    
    // 1. Validate permissions
    if (!ProgressPermission.viewOwnProgress(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Read cache (optional)
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 3. Call services (pure business logic)
    // Validate enrollment
    const enrollment = await enrollmentService.getEnrollmentById(enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    // Students can only view their own progress
    if (user.role === 'student' && enrollment.userId !== user.uid) {
      throw new Error('Unauthorized');
    }

    // 3. Get progress from progress service
    const progressList = await progressService.getProgressByEnrollment(user, enrollmentId);

    // 4. Build clean DTO
    const result = {
      enrollment: {
        enrollmentId: enrollment.enrollmentId,
        courseId: enrollment.courseId,
        courseTitle: enrollment.courseTitle,
      },
      progress: progressList.map(p => ({
        progressId: p.progressId,
        moduleType: p.moduleType,
        moduleId: p.moduleId,
        progress: p.progress,
        completedItems: p.completedItems,
        totalItems: p.totalItems,
        completed: p.completed,
        lastAccessedAt: p.lastAccessedAt,
      })),
    };

    // 5. Cache result
    await cacheClient.set(cacheKey, JSON.stringify(result), 300); // 5 min cache

    return result;
  }

  /**
   * Get progress by course
   * @param {Object} user - Authenticated user
   * @param {string} courseId - Course ID
   * @returns {Object} Progress DTO
   */
  async getProgressByCourse(user, courseId) {
    const cacheKey = REDIS_KEY_REGISTRY.USER_PROGRESS(user.uid, courseId);
    
    // Check cache first
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 1. Check permission
    if (!ProgressPermission.viewOwnProgress(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Validate course exists (Course service - internal)
    const course = await courseService.getCourseByIdInternal(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // 3. Get user's enrollment for this course (Enrollment service)
    const enrollments = await enrollmentService.getUserEnrollments(user.uid);
    const enrollment = enrollments.find(e => e.courseId === courseId);
    if (!enrollment) {
      throw new Error('Not enrolled in this course');
    }

    // 4. Get progress summary from progress service
    const progressSummary = await progressService.getUserCourseProgressSummary(user, courseId);

    // 5. Build clean DTO
    const result = {
      course: {
        courseId: course.courseId,
        title: course.title,
      },
      enrollment: {
        enrollmentId: enrollment.enrollmentId,
        enrolledAt: enrollment.enrolledAt,
      },
      progress: progressSummary,
    };

    // 6. Cache result
    await cacheClient.set(cacheKey, JSON.stringify(result), 300); // 5 min cache

    return result;
  }

  /**
   * Get all progress for user (overview)
   * @param {Object} user - Authenticated user
   * @returns {Object} Progress overview DTO
   */
  async getUserProgressOverview(user) {
    const cacheKey = REDIS_KEY_REGISTRY.USER_PROGRESS_OVERVIEW(user.uid);
    
    // Check cache first
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 1. Check permission
    if (!ProgressPermission.viewOwnProgress(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Get all progress from progress service
    const progressList = await progressService.getProgressByUser(user);

    // 3. Get enrollments for context (Enrollment service)
    const enrollments = await enrollmentService.getUserEnrollments(user.uid);

    // 4. Create enrollment map
    const enrollmentMap = new Map(
      enrollments.map(e => [e.courseId, e])
    );

    // 5. Aggregate by course
    const courseProgress = progressList
      .filter(p => p.moduleType === 'course')
      .map(p => {
        const enrollment = enrollmentMap.get(p.moduleId);
        return {
          courseId: p.moduleId,
          courseTitle: enrollment?.courseTitle || 'Unknown Course',
          progress: p.progress,
          completed: p.completed,
          lastAccessedAt: p.lastAccessedAt,
        };
      });

    // 6. Calculate summary stats
    const totalCourses = courseProgress.length;
    const completedCourses = courseProgress.filter(p => p.completed).length;
    const inProgressCourses = courseProgress.filter(p => !p.completed && p.progress > 0).length;
    const averageProgress = totalCourses > 0
      ? Math.round(courseProgress.reduce((sum, p) => sum + p.progress, 0) / totalCourses)
      : 0;

    // 7. Build clean DTO
    const result = {
      summary: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        averageProgress,
      },
      courses: courseProgress,
    };

    // 8. Cache result
    await cacheClient.set(cacheKey, JSON.stringify(result), 300); // 5 min cache

    return result;
  }
}

export const userProgressOrchestrator = new UserProgressOrchestrator();
