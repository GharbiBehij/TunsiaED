/// Query Keys Registry
/// Centralized query keys mirroring web app structure
/// Used for caching and invalidation with Provider/GetIt
class QueryKeys {
  // ========== User Keys ==========
  static const String user = 'user';
  static String userById(String userId) => 'user_$userId';
  static String userProfile(String userId) => 'user_profile_$userId';

  // ========== Course Keys ==========
  static const String courses = 'courses';
  static String courseById(String courseId) => 'course_$courseId';
  static String courseContent(String courseId) => 'course_content_$courseId';
  static String courseChapters(String courseId) => 'course_chapters_$courseId';
  
  // ========== Student Keys ==========
  static const String studentDashboard = 'student_dashboard';
  static const String studentCourses = 'student_courses';
  static String studentProgress(String userId) => 'student_progress_$userId';
  static String studentEnrollments(String userId) => 'student_enrollments_$userId';
  static String studentCertificates(String userId) => 'student_certificates_$userId';

  // ========== Instructor Keys ==========
  static const String instructorDashboard = 'instructor_dashboard';
  static String instructorCourses(String instructorId) => 'instructor_courses_$instructorId';
  static String instructorStats(String instructorId) => 'instructor_stats_$instructorId';
  static String instructorStudents(String instructorId) => 'instructor_students_$instructorId';

  // ========== Admin Keys ==========
  static const String adminDashboard = 'admin_dashboard';
  static const String adminUsers = 'admin_users';
  static const String adminStats = 'admin_stats';
  static const String adminCourses = 'admin_courses';

  // ========== Enrollment Keys ==========
  static const String enrollments = 'enrollments';
  static String enrollmentById(String enrollmentId) => 'enrollment_$enrollmentId';
  static String enrollmentProgress(String enrollmentId) => 'enrollment_progress_$enrollmentId';
  static String enrollmentsByCourse(String courseId) => 'enrollments_course_$courseId';
  static String enrollmentsByStudent(String studentId) => 'enrollments_student_$studentId';

  // ========== Progress Keys ==========
  static const String progress = 'progress';
  static String progressByEnrollment(String enrollmentId) => 'progress_enrollment_$enrollmentId';
  static String progressByLesson(String lessonId) => 'progress_lesson_$lessonId';

  // ========== Certificate Keys ==========
  static const String certificates = 'certificates';
  static String certificateById(String certificateId) => 'certificate_$certificateId';
  static String certificatesByUser(String userId) => 'certificates_user_$userId';

  // ========== Quiz Keys ==========
  static const String quizzes = 'quizzes';
  static String quizById(String quizId) => 'quiz_$quizId';
  static String quizAttempts(String quizId, String userId) => 'quiz_attempts_${quizId}_$userId';

  // ========== Lesson Keys ==========
  static const String lessons = 'lessons';
  static String lessonById(String lessonId) => 'lesson_$lessonId';
  static String lessonsByChapter(String chapterId) => 'lessons_chapter_$chapterId';

  // ========== Chapter Keys ==========
  static const String chapters = 'chapters';
  static String chapterById(String chapterId) => 'chapter_$chapterId';
  static String chaptersByCourse(String courseId) => 'chapters_course_$courseId';

  // ========== Payment Keys ==========
  static const String payments = 'payments';
  static String paymentById(String paymentId) => 'payment_$paymentId';
  static String paymentsByUser(String userId) => 'payments_user_$userId';

  // ========== Transaction Keys ==========
  static const String transactions = 'transactions';
  static String transactionById(String transactionId) => 'transaction_$transactionId';
  static String transactionsByUser(String userId) => 'transactions_user_$userId';

  // ========== Subscription Keys ==========
  static const String subscriptions = 'subscriptions';
  static const String subscriptionPlans = 'subscription_plans';
  static String activeSubscription(String userId) => 'subscription_active_$userId';

  // ========== Notification Keys ==========
  static const String notifications = 'notifications';
  static String notificationsByUser(String userId) => 'notifications_user_$userId';
  static String unreadNotifications(String userId) => 'notifications_unread_$userId';
}

/// Query Key Patterns for Invalidation
/// Used to invalidate multiple related queries at once
class QueryKeyPatterns {
  static String userPattern(String userId) => 'user_$userId';
  static String coursePattern(String courseId) => 'course_$courseId';
  static String studentPattern(String studentId) => 'student_$studentId';
  static String instructorPattern(String instructorId) => 'instructor_$instructorId';
  static String enrollmentPattern(String enrollmentId) => 'enrollment_$enrollmentId';
}
