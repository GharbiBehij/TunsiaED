// Mutation Effect Map
// Defines all query invalidations and cache clearances for each mutation
// This ensures consistent data synchronization across the entire system

import {
  STUDENT_KEYS,
  INSTRUCTOR_KEYS,
  ADMIN_KEYS,
  COURSE_KEYS,
  CHAPTER_KEYS,
  LESSON_KEYS,
  QUIZ_KEYS,
  PAYMENT_KEYS,
  CERTIFICATE_KEYS,
  ENROLLMENT_KEYS,
  USER_KEYS,
  SUBSCRIPTION_KEYS,
} from './queryKeys';

/**
 * Maps each mutation to its affected React Query keys and Redis cache keys
 * Use this to ensure consistent invalidation across the system
 */
export const MUTATION_EFFECTS = {
  // ====================================================================
  // STUDENT PROGRESS MUTATIONS
  // ====================================================================
  updateProgress: {
    reactQuery: [
      STUDENT_KEYS.progress(),
      STUDENT_KEYS.enrollments(),
      STUDENT_KEYS.dashboard(),
      STUDENT_KEYS.enrollmentsDetailed(),
      STUDENT_KEYS.progressOverview(),
      STUDENT_KEYS.learningOverview(),
      INSTRUCTOR_KEYS.dashboard(),
      INSTRUCTOR_KEYS.coursePerformance(),
      INSTRUCTOR_KEYS.coursePerformanceDetailed(),
      ADMIN_KEYS.dashboard(),
      ADMIN_KEYS.coursePerformance(),
      ADMIN_KEYS.userEngagement(),
    ],
    redis: [
      'student_dashboard_*',
      'student_learning_overview_*',
      'instructor_dashboard_*',
      'instructor_course_stats_*',
      'user_progress_*',
      'course_progress_*',
    ],
  },

  completeItem: {
    reactQuery: [
      STUDENT_KEYS.progress(),
      STUDENT_KEYS.enrollments(),
      STUDENT_KEYS.certificates(),
      STUDENT_KEYS.dashboard(),
      STUDENT_KEYS.enrollmentsDetailed(),
      STUDENT_KEYS.progressOverview(),
      STUDENT_KEYS.learningOverview(),
      INSTRUCTOR_KEYS.dashboard(),
      INSTRUCTOR_KEYS.coursePerformance(),
      INSTRUCTOR_KEYS.coursePerformanceDetailed(),
      ADMIN_KEYS.dashboard(),
      ADMIN_KEYS.coursePerformance(),
      ADMIN_KEYS.userEngagement(),
      ADMIN_KEYS.activity(),
    ],
    redis: [
      'student_dashboard_*',
      'student_learning_overview_*',
      'instructor_dashboard_*',
      'instructor_course_stats_*',
      'user_progress_*',
      'course_progress_*',
    ],
  },

  updateProgressOrchestrated: {
    reactQuery: [
      STUDENT_KEYS.progress(),
      STUDENT_KEYS.enrollments(),
      STUDENT_KEYS.enrollmentsDetailed(),
      STUDENT_KEYS.progressOverview(),
      STUDENT_KEYS.dashboard(),
      STUDENT_KEYS.learningOverview(),
      INSTRUCTOR_KEYS.dashboard(),
      INSTRUCTOR_KEYS.coursePerformance(),
      INSTRUCTOR_KEYS.coursePerformanceDetailed(),
      ADMIN_KEYS.dashboard(),
      ADMIN_KEYS.coursePerformance(),
      ADMIN_KEYS.userEngagement(),
    ],
    redis: [
      'student_dashboard_*',
      'instructor_dashboard_*',
      'user_progress_*',
    ],
  },

  // ====================================================================
  // COURSE MUTATIONS
  // ====================================================================
  createCourse: {
    reactQuery: [
      COURSE_KEYS.all(),
      COURSE_KEYS.instructor(),
      COURSE_KEYS.system(),
      COURSE_KEYS.categories(),
      INSTRUCTOR_KEYS.dashboard(),
      INSTRUCTOR_KEYS.coursePerformance(),
      ADMIN_KEYS.dashboard(),
      ADMIN_KEYS.coursePerformance(),
    ],
    redis: [
      'instructor_dashboard_*',
      'instructor_courses_stats_*',
      'system_courses_*',
    ],
  },

  updateCourse: {
    reactQuery: [
      COURSE_KEYS.all(),
      COURSE_KEYS.instructor(),
      COURSE_KEYS.system(),
      COURSE_KEYS.categories(),
      INSTRUCTOR_KEYS.dashboard(),
      ADMIN_KEYS.dashboard(),
      ADMIN_KEYS.coursePerformance(),
    ],
    redis: [
      'instructor_dashboard_*',
      'course_content_*',
      'system_courses_*',
    ],
  },

  deleteCourse: {
    reactQuery: [
      COURSE_KEYS.all(),
      COURSE_KEYS.instructor(),
      COURSE_KEYS.system(),
      COURSE_KEYS.categories(),
      CHAPTER_KEYS.all(),
      LESSON_KEYS.all(),
      INSTRUCTOR_KEYS.dashboard(),
      ADMIN_KEYS.dashboard(),
      ADMIN_KEYS.coursePerformance(),
    ],
    redis: [
      'instructor_dashboard_*',
      'instructor_courses_stats_*',
      'course_content_*',
      'course_progress_*',
      'system_courses_*',
    ],
  },

  // ====================================================================
  // CHAPTER MUTATIONS
  // ====================================================================
  createChapter: {
    reactQuery: [
      CHAPTER_KEYS.all(),
      COURSE_KEYS.all(),
      INSTRUCTOR_KEYS.dashboard(),
    ],
    redis: [
      'course_content_*',
      'instructor_dashboard_*',
    ],
  },

  updateChapter: {
    reactQuery: [
      CHAPTER_KEYS.all(),
      COURSE_KEYS.all(),
      INSTRUCTOR_KEYS.dashboard(),
    ],
    redis: [
      'course_content_*',
      'instructor_dashboard_*',
    ],
  },

  deleteChapter: {
    reactQuery: [
      CHAPTER_KEYS.all(),
      LESSON_KEYS.all(),
      COURSE_KEYS.all(),
      INSTRUCTOR_KEYS.dashboard(),
    ],
    redis: [
      'course_content_*',
      'instructor_dashboard_*',
    ],
  },

  // ====================================================================
  // LESSON MUTATIONS
  // ====================================================================
  createLesson: {
    reactQuery: [
      LESSON_KEYS.all(),
      CHAPTER_KEYS.all(),
      COURSE_KEYS.all(),
      INSTRUCTOR_KEYS.dashboard(),
    ],
    redis: [
      'course_content_*',
      'instructor_dashboard_*',
    ],
  },

  updateLesson: {
    reactQuery: [
      LESSON_KEYS.all(),
      CHAPTER_KEYS.all(),
      COURSE_KEYS.all(),
      INSTRUCTOR_KEYS.dashboard(),
    ],
    redis: [
      'course_content_*',
      'instructor_dashboard_*',
    ],
  },

  deleteLesson: {
    reactQuery: [
      LESSON_KEYS.all(),
      CHAPTER_KEYS.all(),
      COURSE_KEYS.all(),
      INSTRUCTOR_KEYS.dashboard(),
    ],
    redis: [
      'course_content_*',
      'instructor_dashboard_*',
    ],
  },

  // ====================================================================
  // QUIZ MUTATIONS
  // ====================================================================
  createQuiz: {
    reactQuery: [
      QUIZ_KEYS.all(),
      LESSON_KEYS.all(),
      CHAPTER_KEYS.all(),
      COURSE_KEYS.all(),
      INSTRUCTOR_KEYS.dashboard(),
    ],
    redis: [
      'course_content_*',
      'instructor_dashboard_*',
    ],
  },

  updateQuiz: {
    reactQuery: [
      QUIZ_KEYS.all(),
      LESSON_KEYS.all(),
      CHAPTER_KEYS.all(),
      COURSE_KEYS.all(),
      INSTRUCTOR_KEYS.dashboard(),
    ],
    redis: [
      'course_content_*',
      'instructor_dashboard_*',
    ],
  },

  deleteQuiz: {
    reactQuery: [
      QUIZ_KEYS.all(),
      LESSON_KEYS.all(),
      CHAPTER_KEYS.all(),
      COURSE_KEYS.all(),
      INSTRUCTOR_KEYS.dashboard(),
    ],
    redis: [
      'course_content_*',
      'instructor_dashboard_*',
    ],
  },

  // ====================================================================
  // ENROLLMENT MUTATIONS
  // ====================================================================
  createEnrollment: {
    reactQuery: [
      STUDENT_KEYS.courses(),
      STUDENT_KEYS.enrollments(),
      STUDENT_KEYS.dashboard(),
      ENROLLMENT_KEYS.all(),
      ENROLLMENT_KEYS.student(),
      INSTRUCTOR_KEYS.dashboard(),
      INSTRUCTOR_KEYS.coursePerformance(),
      ADMIN_KEYS.dashboard(),
      ADMIN_KEYS.userEngagement(),
    ],
    redis: [
      'student_dashboard_*',
      'instructor_dashboard_*',
      'enrollment_*',
    ],
  },

  enrollInCourse: {
    reactQuery: [
      STUDENT_KEYS.courses(),
      STUDENT_KEYS.enrollments(),
      STUDENT_KEYS.dashboard(),
      STUDENT_KEYS.enrollmentsDetailed(),
      ENROLLMENT_KEYS.all(),
      ENROLLMENT_KEYS.student(),
      COURSE_KEYS.all(),
      INSTRUCTOR_KEYS.dashboard(),
      INSTRUCTOR_KEYS.coursePerformance(),
      ADMIN_KEYS.dashboard(),
      ADMIN_KEYS.userEngagement(),
    ],
    redis: [
      'student_dashboard_*',
      'instructor_dashboard_*',
      'enrollment_*',
    ],
  },

  // ====================================================================
  // PAYMENT MUTATIONS
  // ====================================================================
  initiatePurchase: {
    reactQuery: [
      PAYMENT_KEYS.history(),
      PAYMENT_KEYS.pending(),
      PAYMENT_KEYS.studentPayments(),
    ],
    redis: [],
  },

  confirmPayment: {
    reactQuery: [
      PAYMENT_KEYS.history(),
      PAYMENT_KEYS.pending(),
      PAYMENT_KEYS.studentPayments(),
      PAYMENT_KEYS.transactions(),
      STUDENT_KEYS.courses(),
      STUDENT_KEYS.enrollments(),
      STUDENT_KEYS.dashboard(),
      ENROLLMENT_KEYS.all(),
      ENROLLMENT_KEYS.student(),
      INSTRUCTOR_KEYS.revenue(),
      INSTRUCTOR_KEYS.revenueTrends(),
      INSTRUCTOR_KEYS.dashboard(),
      ADMIN_KEYS.revenue(),
      ADMIN_KEYS.dashboard(),
    ],
    redis: [
      'student_dashboard_*',
      'instructor_dashboard_*',
      'instructor_revenue_*',
    ],
  },

  // ====================================================================
  // CERTIFICATE MUTATIONS
  // ====================================================================
  grantCertificate: {
    reactQuery: [
      STUDENT_KEYS.certificates(),
      STUDENT_KEYS.dashboard(),
      STUDENT_KEYS.learningOverview(),
      CERTIFICATE_KEYS.all(),
      CERTIFICATE_KEYS.pending(),
      INSTRUCTOR_KEYS.dashboard(),
      ADMIN_KEYS.dashboard(),
    ],
    redis: [
      'student_dashboard_*',
      'student_learning_overview_*',
    ],
  },

  revokeCertificate: {
    reactQuery: [
      STUDENT_KEYS.certificates(),
      STUDENT_KEYS.dashboard(),
      CERTIFICATE_KEYS.all(),
      ADMIN_KEYS.dashboard(),
    ],
    redis: [
      'student_dashboard_*',
    ],
  },

  // ====================================================================
  // USER PROFILE MUTATIONS
  // ====================================================================
  updateProfile: {
    reactQuery: [
      USER_KEYS.profile(),
      STUDENT_KEYS.dashboard(),
      INSTRUCTOR_KEYS.dashboard(),
      ADMIN_KEYS.dashboard(),
    ],
    redis: [
      'student_dashboard_*',
      'instructor_dashboard_*',
    ],
  },

  updateAvatar: {
    reactQuery: [
      USER_KEYS.profile(),
      STUDENT_KEYS.dashboard(),
      INSTRUCTOR_KEYS.dashboard(),
      ADMIN_KEYS.dashboard(),
    ],
    redis: [
      'student_dashboard_*',
      'instructor_dashboard_*',
    ],
  },

  updateSettings: {
    reactQuery: [
      USER_KEYS.settings(),
      USER_KEYS.profile(),
    ],
    redis: [],
  },

  // ====================================================================
  // SUBSCRIPTION MUTATIONS
  // ====================================================================
  initiateSubscription: {
    reactQuery: [
      SUBSCRIPTION_KEYS.all(),
      SUBSCRIPTION_KEYS.plans(),
      SUBSCRIPTION_KEYS.userSubscription(),
      PAYMENT_KEYS.all(),
      PAYMENT_KEYS.pending(),
      PAYMENT_KEYS.history(),
      STUDENT_KEYS.dashboard(),
      STUDENT_KEYS.enrollments(),
      COURSE_KEYS.all(),
      COURSE_KEYS.system(),
      ADMIN_KEYS.subscriptionStats(),
      USER_KEYS.profile(),
    ],
    redis: [
      'student_dashboard_*',
      'student_learning_overview_*',
      'user_subscriptions_*',
      'user_profile_*',
      'subscription_plans_public',
      'system_courses_*',
    ],
  },

  // ====================================================================
  // SUBSCRIPTION CANCEL MUTATION
  // ====================================================================
  cancelSubscription: {
    reactQuery: [
      SUBSCRIPTION_KEYS.all(),
      SUBSCRIPTION_KEYS.userSubscription(),
      SUBSCRIPTION_KEYS.active(),
      USER_KEYS.profile(),
      STUDENT_KEYS.dashboard(),
      STUDENT_KEYS.enrollments(),
    ],
    redis: [
      'user_subscriptions_*',
      'user_profile_*',
      'student_dashboard_*',
      'student_enrollments_*',
    ],
  },

  // ====================================================================
  // ADMIN MUTATIONS
  // ====================================================================
  updateSubscriptionPlan: {
    reactQuery: [
      ADMIN_KEYS.subscriptions(),
      ADMIN_KEYS.subscriptionPlans(),
      SUBSCRIPTION_KEYS.all(),
      SUBSCRIPTION_KEYS.plans(),
      COURSE_KEYS.system(),
      ADMIN_KEYS.dashboard(),
      ADMIN_KEYS.stats(),
      ADMIN_KEYS.revenue(),
    ],
    redis: [
      'subscription_plans_public',
      'subscription_plan_*',
      'system_courses_*',
    ],
  },

  createPromotion: {
    reactQuery: [
      ADMIN_KEYS.promotions(),
      ADMIN_KEYS.activePromotions(),
      ADMIN_KEYS.dashboard(),
      ADMIN_KEYS.stats(),
      ADMIN_KEYS.activity(),
      ADMIN_KEYS.revenue(),
    ],
    redis: [],
  },
};

/**
 * Get all affected React Query keys for a mutation
 * @param {string} mutationName - Name of the mutation
 * @returns {Array} Array of query keys to invalidate
 */
export function getAffectedQueryKeys(mutationName) {
  return MUTATION_EFFECTS[mutationName]?.reactQuery || [];
}

/**
 * Get all affected Redis cache patterns for a mutation
 * @param {string} mutationName - Name of the mutation
 * @returns {Array<string>} Array of Redis key patterns to clear
 */
export function getAffectedCacheKeys(mutationName) {
  return MUTATION_EFFECTS[mutationName]?.redis || [];
}

/**
 * Apply all invalidations for a mutation
 * @param {Object} queryClient - React Query client
 * @param {Function} cacheDelFn - Cache delete function (e.g., cacheClient.delPattern)
 * @param {string} mutationName - Name of the mutation
 */
export async function applyMutationEffects(queryClient, cacheDelFn, mutationName) {
    // Invalidate React Query keys
  const queryKeys = getAffectedQueryKeys(mutationName);
  queryKeys.forEach(key => {
    queryClient.invalidateQueries({ queryKey: key });
  });

  // Clear Redis cache
  const cacheKeys = getAffectedCacheKeys(mutationName);
  for (const pattern of cacheKeys) {
    if (cacheDelFn) {
      await cacheDelFn(pattern);
    }
  }
}

export default MUTATION_EFFECTS;
