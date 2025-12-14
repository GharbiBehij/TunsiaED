// Instructor Dashboard Orchestrator
// Orchestrates cross-module data for instructor dashboard
import { InstructorPermission } from '../Modules/Instructor/service/InstructorPermission.js';
import { instructorService } from '../Modules/Instructor/service/Instructor.service.js';
import { progressService } from '../Modules/Progress/service/Progress.service.js';
import { courseService } from '../Modules/Course/service/Course.service.js';
import { userService } from '../Modules/User/service/User.service.js';
import { cacheClient, REDIS_KEY_REGISTRY } from '../core/cache/cacheClient.js';

//facade design pattern implementation(multiple servvices calls)
export class InstructorDashboardOrchestrator {
  /**
   * Get complete instructor dashboard data
   * @param {Object} user - Authenticated user
   * @returns {Object} Dashboard DTO
   */
  async getDashboardData(user) {
    console.log('📊 [InstructorDash] getDashboardData called:', user.uid);
    const cacheKey = `instructor_dashboard_${user.uid}`;
    
    // 1. Validate permissions
    console.log('🔐 [InstructorDash] Validating permissions...');
    if (!InstructorPermission.getStats(user)) {
      console.error('⛔ [InstructorDash] Unauthorized');
      throw new Error('Unauthorized');
    }
    console.log('✅ [InstructorDash] Permissions validated');

    // 2. Read cache (optional)
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 3. Call services (pure business logic)
    const [stats, revenueTrends, recentActivity, coursePerformance, courses] = await Promise.all([
      instructorService.getStats(user),
      instructorService.getRevenueTrends(user),
      instructorService.getRecentActivity(user, 10),
      instructorService.getCoursePerformance(user),
      instructorService.getCourses(user),
    ]);

    // 4. Build result DTO
    const result = {
      stats,
      revenueTrends,
      recentActivity,
      coursePerformance,
      courses
    };

    // 5. Update Redis cache
    await cacheClient.set(cacheKey, result, 300); // 5 min cache

    // 6. Return final aggregated response
    return result;
  }

  /**
   * Get instructor revenue overview
   * @param {Object} user - Authenticated user
   * @returns {Object} Revenue DTO
   */
  async getRevenueOverview(user) {
    const cacheKey = `instructor_revenue_${user.uid}`;
    
    // 1. Validate permissions
    if (!InstructorPermission.getRevenue(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Read cache (optional)
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 3. Call services (pure business logic)
    const [revenue, revenueTrends] = await Promise.all([
      instructorService.getRevenue(user),
      instructorService.getRevenueTrends(user),
    ]);

    // 4. Build result DTO
    const result = {
      total: revenue,
      trends: revenueTrends,
    };

    // 5. Update Redis cache
    await cacheClient.set(cacheKey, result, 300); // 5 min cache

    // 6. Return final aggregated response
    return result;
  }

  /**
   * Get instructor course performance with student progress
   * @param {Object} user - Authenticated user
   * @param {string} courseId - Course ID (optional, for specific course)
   * @returns {Object} Performance DTO
   */
  async getCoursePerformanceWithProgress(user, courseId = null) {
    // 1. Check permission
    if (!InstructorPermission.getCourses(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Fetch course performance
    const coursePerformance = await instructorService.getCoursePerformance(user);

    // 3. If specific course requested, get student progress
    if (courseId) {
      const studentProgress = await this.getStudentProgressForCourse(user, courseId);
      
      // Find the course in performance data
      const specificCourse = coursePerformance.find(c => c.courseId === courseId);
      
      return {
        course: specificCourse,
        students: studentProgress,
      };
    }

    // 4. Return all courses performance
    return {
      courses: coursePerformance,
    };
  }

  // ====================================================================
  // CROSS-MODULE OPERATIONS (Instructor + Progress + Course + User)
  // ====================================================================

  /**
   * Get student progress for a specific course
   * Cross-module: Instructor + Progress + Course + User
   * @param {Object} user - The authenticated user
   * @param {string} courseId - The course ID
   * @returns {Object[]} Array of student progress DTOs
   */
  async getStudentProgressForCourse(user, courseId) {
    // 1. Check permission
    if (!InstructorPermission.getCourses(user)) {
      throw new Error('Unauthorized');
    }
    
    // 2. Verify the course belongs to this instructor (Course service - internal)
    const course = await courseService.getCourseByIdInternal(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (course.instructorId !== user.uid && !user.isAdmin) {
      throw new Error('Unauthorized: Course does not belong to this instructor');
    }

    // 3. Get all progress records for this course (Progress service - internal)
    const progressList = await progressService.getProgressByModuleInternal('course', courseId);

    // 4. Get unique user IDs
    const userIds = [...new Set(progressList.map(p => p.userId))];

    // 5. Batch fetch users (User service - internal)
    const users = await userService.getUsersByUidsInternal(userIds);
    const userMap = new Map(users.map(u => [u.uid, u]));

    // 6. Enrich progress with user data and return clean DTOs
    return progressList.map(progress => {
      const student = userMap.get(progress.userId);
      return {
        progressId: progress.progressId,
        userId: progress.userId,
        studentName: student?.name || student?.displayName || 'Unknown Student',
        studentEmail: student?.email || '',
        studentAvatar: student?.avatar || null,
        progress: progress.progress,
        completedItems: progress.completedItems,
        totalItems: progress.totalItems,
        completed: progress.completed,
        startedAt: progress.startedAt,
        completedAt: progress.completedAt,
        lastAccessedAt: progress.lastAccessedAt,
      };
    });
  }

  /**
   * Get instructor's courses with enrollment and progress stats
   * Cross-module: Instructor + Course + Enrollment + Progress
   * @param {Object} user - Authenticated user
   * @returns {Object[]} Array of course stats DTOs
   */
  async getCoursesWithStats(user) {
    const cacheKey = REDIS_KEY_REGISTRY.INSTRUCTOR_STUDENTS(user.uid);
    
    // Check cache first
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 1. Check permission
    if (!InstructorPermission.getCourses(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Get courses from instructor service
    const courses = await instructorService.getCourses(user);

    // 3. For each course, get progress stats using Progress service
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        try {
          const progressList = await progressService.getProgressByModuleInternal('course', course.courseId);

          const totalStudents = progressList.length;
          const completedCount = progressList.filter(p => p.completed).length;
          const averageProgress = totalStudents > 0
            ? Math.round(progressList.reduce((sum, p) => sum + p.progress, 0) / totalStudents)
            : 0;

          return {
            ...course,
            stats: {
              totalStudents,
              completedCount,
              completionRate: totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0,
              averageProgress,
            },
          };
        } catch {
          return {
            ...course,
            stats: {
              totalStudents: 0,
              completedCount: 0,
              completionRate: 0,
              averageProgress: 0,
            },
          };
        }
      })
    );

    // 4. Cache result
    await cacheClient.set(cacheKey, coursesWithStats, 300); // 5 min cache

    return coursesWithStats;
  }
}

export const instructorDashboardOrchestrator = new InstructorDashboardOrchestrator();
