/// Constants used throughout the app
class AppConstants {
  // App Info
  static const String appName = 'E-Platform';
  static const String appTagline = 'Learn, Grow, Succeed';

  // User Roles
  static const String roleStudent = 'student';
  static const String roleInstructor = 'instructor';
  static const String roleAdmin = 'admin';

  // Payment Status
  static const String paymentPending = 'pending';
  static const String paymentCompleted = 'completed';
  static const String paymentFailed = 'failed';

  // Enrollment Status
  static const String enrollmentActive = 'active';
  static const String enrollmentCompleted = 'completed';
  static const String enrollmentExpired = 'expired';

  // Course Status
  static const String courseDraft = 'draft';
  static const String coursePublished = 'published';
  static const String courseArchived = 'archived';

  // Lesson Types
  static const String lessonTypeVideo = 'video';
  static const String lessonTypeText = 'text';
  static const String lessonTypeQuiz = 'quiz';

  // Quiz Types
  static const String quizTypeMultipleChoice = 'multiple_choice';
  static const String quizTypeTrueFalse = 'true_false';
  static const String quizTypeShortAnswer = 'short_answer';

  // Certificate Status
  static const String certificateIssued = 'issued';
  static const String certificateRevoked = 'revoked';

  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;

  // Cache Durations
  static const Duration shortCacheDuration = Duration(minutes: 5);
  static const Duration mediumCacheDuration = Duration(minutes: 30);
  static const Duration longCacheDuration = Duration(hours: 2);

  // Validation
  static const int minPasswordLength = 6;
  static const int maxPasswordLength = 50;
  static const int minNameLength = 2;
  static const int maxNameLength = 100;

  // File Upload
  static const int maxFileSize = 10 * 1024 * 1024; // 10 MB
  static const List<String> allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif'];
  static const List<String> allowedVideoTypes = ['mp4', 'mov', 'avi'];
  static const List<String> allowedDocTypes = ['pdf', 'doc', 'docx'];

  // UI
  static const double defaultPadding = 16.0;
  static const double smallPadding = 8.0;
  static const double largePadding = 24.0;
  static const double borderRadius = 8.0;

  // Animation
  static const Duration shortAnimationDuration = Duration(milliseconds: 200);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 400);
  static const Duration longAnimationDuration = Duration(milliseconds: 600);
}
