/// Backend API Endpoints
/// Mirrors the backend route structure exactly
class ApiEndpoints {
  // Base
  static const String base = '/api/v1';

  // Auth Endpoints (kept for parity with web; Firebase handles primary auth)
  static const String login = '$base/auth/login';
  static const String register = '$base/auth/register';
  static const String logout = '$base/auth/logout';
  static const String refreshToken = '$base/auth/refresh';
  static const String forgotPassword = '$base/auth/forgot-password';
  static const String resetPassword = '$base/auth/reset-password';

  // User Endpoints
  static const String users = '$base/user';
  static const String userOnboard = '$users/onboard';
  static const String userMe = '$users/me';
  static String userById(String userId) => '$users/$userId';
  static String userProfile(String _userId) => userMe;

  // Course Endpoints
  static const String courses = '$base/course';
  static String courseById(String courseId) => '$courses/$courseId';
  static String courseContent(String courseId) => '$courses/$courseId/content';
  static String courseEnroll(String courseId) => '$courses/$courseId/enroll';

  // Student Endpoints
  static const String _studentBase = '$base/student';
  static const String studentDashboard = '$_studentBase/dashboard';
  static const String studentCourses = '$_studentBase/courses';
  static const String studentProgress = '$_studentBase/progress';
  static const String studentEnrollments = '$_studentBase/enrollments';
  static const String studentCertificates = '$_studentBase/certificates';
  static const String studentStats = '$_studentBase/stats';
  // Student Orchestrator Endpoints
  static const String studentEnrollmentsDetailed = '$_studentBase/enrollments/detailed';
  static const String studentLearningOverview = '$_studentBase/learning/overview';
  static const String studentProgressOverview = '$_studentBase/progress/overview';
  static const String studentProgressUpdate = '$_studentBase/progress/update';
  static String studentProgressByEnrollment(String enrollmentId) =>
    '$_studentBase/progress/enrollment/$enrollmentId';
  static String studentProgressByCourse(String courseId) =>
    '$_studentBase/progress/course/$courseId';

  // Instructor Endpoints
  static const String _instructorBase = '$base/instructor';
  static const String instructorDashboard = '$_instructorBase/dashboard';
  static const String instructorCourses = '$_instructorBase/courses';
  static const String instructorStats = '$_instructorBase/stats';
  static const String instructorRevenue = '$_instructorBase/revenue';
  static const String instructorRevenueTrends = '$_instructorBase/revenue-trends';
  static const String instructorActivity = '$_instructorBase/activity';
  static const String instructorStudents = '$_instructorBase/students';
  static const String instructorCoursePerformance = '$_instructorBase/courses/performance';
  // Instructor Orchestrator Endpoints
  static const String instructorRevenueOverview = '$_instructorBase/revenue/overview';
  static const String instructorCoursePerformanceDetailed =
    '$_instructorBase/courses/performance/detailed';
  static String instructorCourseStudentsProgress(String courseId) =>
    '$_instructorBase/courses/$courseId/students/progress';

  // Admin Endpoints
  static const String _adminBase = '$base/admin';
  static const String adminDashboard = '$_adminBase/dashboard';
  static const String adminUsers = '$_adminBase/users';
  static const String adminCourses = '$_adminBase/courses';
  static const String adminStats = '$_adminBase/stats';
  static const String adminRevenue = '$_adminBase/revenue';
  static const String adminActivity = '$_adminBase/activity';
  static const String adminCoursePerformance = '$_adminBase/courses/performance';
  static const String adminUserEngagement = '$_adminBase/engagement';
  static const String adminPromotions = '$_adminBase/promotions';
  static const String adminActivePromotions = '$_adminBase/promotions/active';
  static const String adminSubscriptionPlans = '$_adminBase/subscriptions/plans';
  static const String adminSubscriptionStats = '$_adminBase/subscriptions/stats';
  static String adminSubscriptionPlan(String planId) => '$_adminBase/subscriptions/$planId';
  // Admin User Management
  static String adminBanUser(String userId) => '$_adminBase/users/$userId/ban';
  static String adminUnbanUser(String userId) => '$_adminBase/users/$userId/unban';
  // Admin Instructor Management
  static String adminApproveInstructor(String userId) => '$_adminBase/instructors/$userId/approve';
  static String adminDeclineInstructor(String userId) => '$_adminBase/instructors/$userId/decline';
  // Admin Course Management
  static String adminApproveCourse(String courseId) => '$_adminBase/courses/$courseId/approve';
  static String adminRejectCourse(String courseId) => '$_adminBase/courses/$courseId/reject';

  // Payment Endpoints
  static const String payments = '$base/payment';
  static const String myPayments = '$payments/my-payments';
  static String paymentById(String paymentId) => '$payments/$paymentId';
  static String coursePayments(String courseId) => '$payments/course/$courseId';
  static String paymentsByStatus(String status) => '$payments/status/$status';
  // Payment Orchestrator Endpoints (Purchase Flow)
  static const String purchaseInitiate = '$payments/purchase/initiate';
  static const String purchaseComplete = '$payments/purchase/complete';
  static String purchaseStatus(String paymentId) => '$payments/purchase/$paymentId/status';
  // Stripe Gateway Endpoints
  static const String stripeInitiate = '$payments/stripe/initiate';
  static String stripeStatus(String sessionId) => '$payments/stripe/status/$sessionId';
  // Testing Endpoint
  static const String simulatePayment = '$payments/simulate';
  // Public subscription endpoints (exposed via payment module)
  static const String paymentSubscriptionPlans = '$payments/subscriptions/plans';
  static String paymentSubscriptionPlanById(String planId) =>
    '$payments/subscriptions/plans/$planId';

  // PromoCode Endpoints (Shopping Cart Module)
  static const String _promoCodeBase = '$base/promo-code';
  static const String promoCodeValidate = '$_promoCodeBase/validate';
  static const String promoCodes = _promoCodeBase;
  static String promoCodeById(String promoCodeId) => '$_promoCodeBase/$promoCodeId';

  // Enrollment Endpoints
  static const String enrollments = '$base/enrollment';
  static const String myEnrollments = '$enrollments/my-enrollments';
  static String enrollmentById(String enrollmentId) => '$enrollments/$enrollmentId';
  static String enrollmentProgress(String enrollmentId) => '$enrollments/$enrollmentId/progress';

  // Transaction Endpoints
  static const String transactions = '$base/transaction';
  static String transactionById(String transactionId) => '$transactions/$transactionId';

  // Certificate Endpoints
  static const String certificates = '$base/certificate';
  static String certificateById(String certificateId) => '$certificates/$certificateId';

  // Progress Endpoints
  static const String progress = '$base/progress';
  static const String myProgress = '$progress/my-progress';
  static String progressById(String progressId) => '$progress/$progressId';
  static String progressByEnrollment(String enrollmentId) =>
    '$progress/enrollment/$enrollmentId';
  static String progressCompleteItem(String progressId) =>
    '$progress/$progressId/complete-item';
  static String progressByCourse(String courseId) => '$progress/course/$courseId/summary';

  // Quiz Endpoints
  static const String quizzes = '$base/quiz';
  static String quizById(String quizId) => '$quizzes/$quizId';
  static String quizSubmit(String quizId) => '$quizzes/$quizId/submit';

  // Lesson Endpoints
  static const String lessons = '$base/lesson';
  static String lessonById(String lessonId) => '$lessons/$lessonId';

  // Chapter Endpoints
  static const String chapters = '$base/chapter';
  static String chapterById(String chapterId) => '$chapters/$chapterId';
}
