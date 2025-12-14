// Central Query Key Registry
// Standardized React Query keys for all domains
// Ensures consistency and prevents cache key collisions

/**
 * USER DOMAIN KEYS
 */
export const USER_KEYS = {
  all: () => ['user'],
  profile: () => [...USER_KEYS.all(), 'profile'],
  preferences: () => [...USER_KEYS.all(), 'preferences'],
  settings: () => [...USER_KEYS.all(), 'settings'],
};

/**
 * AUTH DOMAIN KEYS
 */
export const AUTH_KEYS = {
  all: () => ['auth'],
  login: () => [...AUTH_KEYS.all(), 'login'],
  signup: () => [...AUTH_KEYS.all(), 'signup'],
};

/**
 * ROLES DOMAIN KEYS
 */
export const ROLES_KEYS = {
  all: () => ['roles'],
  redirect: () => [...ROLES_KEYS.all(), 'redirect'],
};

/**
 * STUDENT DOMAIN KEYS
 */
export const STUDENT_KEYS = {
  all: () => ['student'],
  // Direct service keys
  stats: () => [...STUDENT_KEYS.all(), 'stats'],
  courses: () => [...STUDENT_KEYS.all(), 'courses'],
  enrollments: () => [...STUDENT_KEYS.all(), 'enrollments'],
  progress: () => [...STUDENT_KEYS.all(), 'progress'],
  certificates: () => [...STUDENT_KEYS.all(), 'certificates'],
  // Orchestrated keys
  dashboard: () => [...STUDENT_KEYS.all(), 'dashboard'],
  enrollmentsDetailed: () => [...STUDENT_KEYS.all(), 'enrollments-detailed'],
  learningOverview: () => [...STUDENT_KEYS.all(), 'learning-overview'],
  progressOverview: () => [...STUDENT_KEYS.all(), 'progress-overview'],
  progressByEnrollment: (enrollmentId) => [...STUDENT_KEYS.all(), 'enrollment', enrollmentId, 'progress'],
  progressByCourse: (courseId) => [...STUDENT_KEYS.all(), 'course', courseId, 'progress'],
  progressDetail: (progressId) => [...STUDENT_KEYS.all(), 'progress-detail', progressId],
};

/**
 * INSTRUCTOR DOMAIN KEYS
 */
export const INSTRUCTOR_KEYS = {
  all: () => ['instructor'],
  // Direct service keys
  stats: () => [...INSTRUCTOR_KEYS.all(), 'stats'],
  courses: () => [...INSTRUCTOR_KEYS.all(), 'courses'],
  students: () => [...INSTRUCTOR_KEYS.all(), 'students'],
  revenue: () => [...INSTRUCTOR_KEYS.all(), 'revenue'],
  revenueTrends: () => [...INSTRUCTOR_KEYS.revenue(), 'trends'],
  activity: () => [...INSTRUCTOR_KEYS.all(), 'activity'],
  coursePerformance: () => [...INSTRUCTOR_KEYS.all(), 'course-performance'],
  studentProgress: (courseId) => [...INSTRUCTOR_KEYS.all(), 'course', courseId, 'student-progress'],
  status: () => [...INSTRUCTOR_KEYS.all(), 'status'],
  // Orchestrated keys
  dashboard: () => [...INSTRUCTOR_KEYS.all(), 'dashboard'],
  revenueOverview: () => [...INSTRUCTOR_KEYS.all(), 'revenue-overview'],
  coursePerformanceDetailed: (courseId) => [...INSTRUCTOR_KEYS.all(), 'course-performance-detailed', courseId || 'all'],
};

/**
 * ADMIN DOMAIN KEYS
 */
export const ADMIN_KEYS = {
  all: () => ['admin'],
  // Direct service keys
  stats: () => [...ADMIN_KEYS.all(), 'stats'],
  revenue: () => [...ADMIN_KEYS.all(), 'revenue'],
  activity: () => [...ADMIN_KEYS.all(), 'activity'],
  coursePerformance: () => [...ADMIN_KEYS.all(), 'course-performance'],
  userEngagement: () => [...ADMIN_KEYS.all(), 'user-engagement'],
  activePromotions: () => [...ADMIN_KEYS.all(), 'promotions', 'active'],
  subscriptionPlans: () => [...ADMIN_KEYS.all(), 'subscriptions', 'plans'],
  subscriptionStats: () => [...ADMIN_KEYS.all(), 'subscriptions', 'stats'],
  subscriptions: () => [...ADMIN_KEYS.all(), 'subscriptions'],
  promotions: () => [...ADMIN_KEYS.all(), 'promotions'],
  // User management keys
  users: (filters = {}) => [...ADMIN_KEYS.all(), 'users', filters],
  // Course management keys
  courses: (filters = {}) => [...ADMIN_KEYS.all(), 'courses', filters],
  // Orchestrated keys
  dashboard: () => [...ADMIN_KEYS.all(), 'dashboard'],
};

/**
 * COURSE DOMAIN KEYS
 */
export const COURSE_KEYS = {
  all: () => ['Courses'],
  detail: (courseId) => ['Courses', courseId],
  category: (category) => ['Courses', 'category', category],
  instructor: () => ['Courses', 'instructor'],
  system: () => ['Courses', 'system'],
  categories: () => ['Courses', 'categories'],
};
/** CART DOMAIN KEYS
 */
export const CART_KEYS = {
  all: () => ['cart'],
  current: () => [...CART_KEYS.all(), 'current'],
  summary: () => [...CART_KEYS.all(), 'summary'],
};

/**
 * PAYMENT DOMAIN KEYS
 */
export const PAYMENT_KEYS = {
  all: () => ['payments'],
  mine: () => [...PAYMENT_KEYS.all(), 'mine'],
  byId: (paymentId) => [...PAYMENT_KEYS.all(), paymentId],
  byCourse: (courseId) => [...PAYMENT_KEYS.all(), 'course', courseId],
  byStatus: (status) => [...PAYMENT_KEYS.all(), 'status', status],
  purchaseStatus: (paymentId) => [...PAYMENT_KEYS.all(), 'purchase', paymentId],
  stripeStatus: (sessionId) => [...PAYMENT_KEYS.all(), 'stripe', 'status', sessionId],
  paymeeStatus: (token) => [...PAYMENT_KEYS.all(), 'paymee', 'status', token], // Legacy - redirects to stripeStatus
  history: () => [...PAYMENT_KEYS.all(), 'history'],
  pending: () => [...PAYMENT_KEYS.all(), 'pending'],
  detail: (paymentId) => [...PAYMENT_KEYS.all(), paymentId],
  transactions: () => [...PAYMENT_KEYS.all(), 'transactions'],
  studentPayments: () => [...PAYMENT_KEYS.all(), 'student'],
  instructorRevenue: () => [...PAYMENT_KEYS.all(), 'instructor', 'revenue'],
};

/**
 * CERTIFICATE DOMAIN KEYS
 */
export const CERTIFICATE_KEYS = {
  all: () => ['certificates'],
  user: (userId) => [...CERTIFICATE_KEYS.all(), 'user', userId],
  detail: (certificateId) => [...CERTIFICATE_KEYS.all(), certificateId],
  verify: (certificateId) => [...CERTIFICATE_KEYS.all(), 'verify', certificateId],
  course: (courseId) => [...CERTIFICATE_KEYS.all(), 'course', courseId],
  pending: () => [...CERTIFICATE_KEYS.all(), 'pending'],
  byEnrollment: (enrollmentId) => [...CERTIFICATE_KEYS.all(), 'enrollment', enrollmentId],
  templates: () => [...CERTIFICATE_KEYS.all(), 'templates'],
};

/**
 * ENROLLMENT DOMAIN KEYS
 */
export const ENROLLMENT_KEYS = {
  all: () => ['enrollments'],
  student: () => [...ENROLLMENT_KEYS.all(), 'student'],
  course: (courseId) => [...ENROLLMENT_KEYS.all(), 'course', courseId],
  detail: (enrollmentId) => [...ENROLLMENT_KEYS.all(), enrollmentId],
  active: () => [...ENROLLMENT_KEYS.all(), 'active'],
  completed: () => [...ENROLLMENT_KEYS.all(), 'completed'],
};

/**
 * PROGRESS DOMAIN KEYS
 */
export const PROGRESS_KEYS = {
  all: () => ['progress'],
  user: () => [...PROGRESS_KEYS.all(), 'user'],
  course: (courseId) => [...PROGRESS_KEYS.all(), 'course', courseId],
  enrollment: (enrollmentId) => [...PROGRESS_KEYS.all(), 'enrollment', enrollmentId],
  detail: (progressId) => [...PROGRESS_KEYS.all(), progressId],
};

/**
 * QUIZ DOMAIN KEYS
 */
export const QUIZ_KEYS = {
  all: () => ['quizzes'],
  detail: (quizId) => [...QUIZ_KEYS.all(), quizId],
  byCourse: (courseId) => [...QUIZ_KEYS.all(), 'course', courseId],
  byLesson: (lessonId) => [...QUIZ_KEYS.all(), 'lesson', lessonId],
};

/**
 * CHAPTER DOMAIN KEYS
 */
export const CHAPTER_KEYS = {
  all: () => ['chapters'],
  detail: (chapterId) => [...CHAPTER_KEYS.all(), chapterId],
  byCourse: (courseId) => [...CHAPTER_KEYS.all(), 'course', courseId],
};

/**
 * LESSON DOMAIN KEYS
 */
export const LESSON_KEYS = {
  all: () => ['lessons'],
  detail: (lessonId) => [...LESSON_KEYS.all(), lessonId],
  byCourse: (courseId) => [...LESSON_KEYS.all(), 'course', courseId],
  byChapter: (chapterId) => [...LESSON_KEYS.all(), 'chapter', chapterId],
};

/**
 * SUBSCRIPTION DOMAIN KEYS
 */
export const SUBSCRIPTION_KEYS = {
  all: () => ['subscriptions'],
  plans: () => [...SUBSCRIPTION_KEYS.all(), 'plans'],
  plan: (planId) => [...SUBSCRIPTION_KEYS.all(), 'plan', planId],
  userSubscription: () => [...SUBSCRIPTION_KEYS.all(), 'user'],
  active: () => [...SUBSCRIPTION_KEYS.all(), 'active'],
};

/**
 * PROMO CODE DOMAIN KEYS
 */
export const PROMO_CODE_KEYS = {
  all: () => ['promo-codes'],
  validate: (code, subtotal, courseId) => [...PROMO_CODE_KEYS.all(), 'validate', code, subtotal, courseId],
  list: () => [...PROMO_CODE_KEYS.all(), 'list'],
  detail: (promoCodeId) => [...PROMO_CODE_KEYS.all(), promoCodeId],
};

/**
 * TRANSACTION DOMAIN KEYS
 */
export const TRANSACTION_KEYS = {
  all: () => ['transactions'],
  user: () => [...TRANSACTION_KEYS.all(), 'user'],
  detail: (transactionId) => [...TRANSACTION_KEYS.all(), transactionId],
  byPayment: (paymentId) => [...TRANSACTION_KEYS.all(), 'payment', paymentId],
  byCourse: (courseId) => [...TRANSACTION_KEYS.all(), 'course', courseId],
  byStatus: (status) => [...TRANSACTION_KEYS.all(), 'status', status],
};

/**
 * Helper function to get all keys for a domain
 */
export const getAllDomainKeys = (domain) => {
  const keyMap = {
    user: USER_KEYS,
    student: STUDENT_KEYS,
    instructor: INSTRUCTOR_KEYS,
    admin: ADMIN_KEYS,
    course: COURSE_KEYS,
    chapter: CHAPTER_KEYS,
    lesson: LESSON_KEYS,
    quiz: QUIZ_KEYS,
    payment: PAYMENT_KEYS,
    certificate: CERTIFICATE_KEYS,
    enrollment: ENROLLMENT_KEYS,
    progress: PROGRESS_KEYS,
    subscription: SUBSCRIPTION_KEYS,
    promoCode: PROMO_CODE_KEYS,
    transaction: TRANSACTION_KEYS,
    cart: CART_KEYS,
  };
  return keyMap[domain]?.all() || [];
};

/**
 * Query key registry for reference
 */
export const QUERY_KEY_REGISTRY = {
  USER_KEYS,
  AUTH_KEYS,
  ROLES_KEYS,
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
  PROGRESS_KEYS,
  SUBSCRIPTION_KEYS,
  PROMO_CODE_KEYS,
  TRANSACTION_KEYS,
  CART_KEYS,
};

export default QUERY_KEY_REGISTRY;
