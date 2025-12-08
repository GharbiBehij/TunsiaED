import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Student Service
/// Handles all student-related API calls
class StudentService {
  final ApiClient _apiClient = ApiClient();

  /// Get student dashboard
  Future<Map<String, dynamic>> getStudentDashboard() async {
    final response = await _apiClient.get(
      ApiEndpoints.studentDashboard,
    );
    return response.data;
  }

  /// Get student courses (enrolled courses)
  Future<List<Map<String, dynamic>>> getStudentCourses() async {
    final response = await _apiClient.get(
      ApiEndpoints.studentCourses,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get student progress
  Future<Map<String, dynamic>> getStudentProgress() async {
    final response = await _apiClient.get(
      ApiEndpoints.studentProgress,
    );
    return response.data;
  }

  /// Get student progress for specific course
  Future<Map<String, dynamic>> getCourseProgress(String courseId) async {
    final response = await _apiClient.get(
      ApiEndpoints.studentProgressByCourse(courseId),
    );
    return response.data;
  }

  /// Get student certificates
  Future<List<Map<String, dynamic>>> getStudentCertificates() async {
    final response = await _apiClient.get(
      ApiEndpoints.studentCertificates,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get student transactions
  Future<List<Map<String, dynamic>>> getStudentTransactions() async {
    final response = await _apiClient.get(
      '${ApiEndpoints.transactions}/my-transactions',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  // ========== ORCHESTRATOR METHODS (Cross-Module Operations) ==========

  /// Get enrollments with detailed progress (ORCHESTRATOR)
  /// Cross-module: Student + Progress modules
  /// Returns enrollments merged with progress details
  Future<Map<String, dynamic>> getEnrollmentsWithProgress() async {
    final response = await _apiClient.get(
      ApiEndpoints.studentEnrollmentsDetailed,
    );
    return response.data;
  }

  /// Get learning overview (ORCHESTRATOR)
  /// Cross-module: Student + Progress + Certificate modules
  /// Returns comprehensive learning stats, progress, and certificates
  Future<Map<String, dynamic>> getLearningOverview() async {
    final response = await _apiClient.get(
      ApiEndpoints.studentLearningOverview,
    );
    return response.data;
  }

  /// Get progress overview (ORCHESTRATOR)
  /// Cross-module: Student + Progress modules
  /// Returns summary of progress across all courses
  Future<Map<String, dynamic>> getProgressOverview() async {
    final response = await _apiClient.get(
      ApiEndpoints.studentProgressOverview,
    );
    return response.data;
  }

  /// Get progress by enrollment (ORCHESTRATOR)
  /// Cross-module: Progress + Enrollment modules
  /// Returns detailed progress for specific enrollment
  Future<Map<String, dynamic>> getProgressByEnrollment(String enrollmentId) async {
    final response = await _apiClient.get(
      ApiEndpoints.studentProgressByEnrollment(enrollmentId),
    );
    return response.data;
  }

  /// Get progress by course (ORCHESTRATOR)
  /// Cross-module: Progress + Enrollment + Course modules
  /// Returns course-specific progress summary
  Future<Map<String, dynamic>> getProgressByCourse(String courseId) async {
    final response = await _apiClient.get(
      ApiEndpoints.studentProgressByCourse(courseId),
    );
    return response.data;
  }

  /// Update progress with orchestration (ORCHESTRATOR)
  /// Cross-module: Progress + Enrollment modules
  /// Updates progress and syncs with enrollment automatically
  Future<Map<String, dynamic>> updateProgressOrchestrated(Map<String, dynamic> progressData) async {
    final response = await _apiClient.post(
      ApiEndpoints.studentProgressUpdate,
      data: progressData,
    );
    return response.data;
  }

  /// Get student stats (DIRECT)
  /// Single module operation
  Future<Map<String, dynamic>> getStudentStats() async {
    final response = await _apiClient.get(
      ApiEndpoints.studentStats,
    );
    return response.data;
  }

  /// Get student enrollments (DIRECT)
  /// Single module operation
  Future<List<Map<String, dynamic>>> getStudentEnrollments() async {
    final response = await _apiClient.get(
      ApiEndpoints.studentEnrollments,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get student courses (DIRECT)
  /// Single module operation
  Future<List<Map<String, dynamic>>> getStudentCourses() async {
    final response = await _apiClient.get(
      ApiEndpoints.studentCourses,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Update student progress (DIRECT)
  /// Single module operation
  Future<Map<String, dynamic>> updateProgress(
    Map<String, dynamic> progressData,
  ) async {
    final response = await _apiClient.patch(
      ApiEndpoints.studentProgress,
      data: progressData,
    );
    return response.data;
  }
}
