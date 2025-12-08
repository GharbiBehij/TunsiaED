import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Enrollment Service
/// Handles all enrollment-related API calls
class EnrollmentService {
  final ApiClient _apiClient = ApiClient();

  /// Get all enrollments for current user
  Future<List<Map<String, dynamic>>> getEnrollments() async {
    final response = await _apiClient.get(
      ApiEndpoints.myEnrollments,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get enrollment by ID
  Future<Map<String, dynamic>> getEnrollmentById(String enrollmentId) async {
    final response = await _apiClient.get(
      ApiEndpoints.enrollmentById(enrollmentId),
    );
    return response.data;
  }

  /// Get enrollment progress
  Future<Map<String, dynamic>> getEnrollmentProgress(
    String enrollmentId,
  ) async {
    final response = await _apiClient.get(
      ApiEndpoints.enrollmentProgress(enrollmentId),
    );
    return response.data;
  }

  /// Create enrollment
  Future<Map<String, dynamic>> createEnrollment(
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.post(
      '${ApiEndpoints.enrollments}/enroll',
      data: data,
    );
    return response.data;
  }

  /// Cancel enrollment
  Future<void> cancelEnrollment(String enrollmentId) async {
    await _apiClient.delete(
      ApiEndpoints.enrollmentById(enrollmentId),
    );
  }

  /// Get enrollments by course (instructor/admin only)
  Future<List<Map<String, dynamic>>> getEnrollmentsByCourse(
    String courseId,
  ) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.enrollments}/course/$courseId/students',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Enroll in course (standardized method name)
  Future<Map<String, dynamic>> enroll(Map<String, dynamic> data) async {
    final response = await _apiClient.post(
      '${ApiEndpoints.enrollments}/enroll',
      data: data,
    );
    return response.data;
  }

  /// Get user enrollments (alias for consistency)
  Future<List<Map<String, dynamic>>> getUserEnrollments() async {
    return getEnrollments();
  }

  /// Get course enrollments with progress (instructor)
  Future<Map<String, dynamic>> getCourseEnrollmentsWithProgress(
    String courseId,
  ) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.enrollments}/course/$courseId/progress',
    );
    return response.data;
  }
}
