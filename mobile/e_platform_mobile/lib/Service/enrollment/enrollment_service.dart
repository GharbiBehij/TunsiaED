import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Enrollment Service
/// Handles all enrollment-related API calls
/// Follows exact web architecture
class EnrollmentService {
  final ApiClient _apiClient = ApiClient();

  /// Enrolls a user in a course
  /// @param enrollmentData - Enrollment data (courseId, etc.)
  /// @returns Enrollment confirmation
  Future<Map<String, dynamic>> enroll(Map<String, dynamic> enrollmentData) async {
    final response = await _apiClient.post(
      '${ApiEndpoints.enrollments}/enroll',
      data: enrollmentData,
    );
    return response.data;
  }

  /// Fetches enrollments for the authenticated user
  /// @returns List of user's enrollments
  Future<List<Map<String, dynamic>>> getUserEnrollments() async {
    final response = await _apiClient.get(
      ApiEndpoints.myEnrollments,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Fetches a specific enrollment by ID
  /// @param enrollmentId - The ID of the enrollment
  /// @returns Enrollment data
  Future<Map<String, dynamic>> getEnrollmentById(String enrollmentId) async {
    final response = await _apiClient.get(
      ApiEndpoints.enrollmentById(enrollmentId),
    );
    return response.data;
  }

  /// Fetches enrollment with detailed progress information
  /// @param enrollmentId - The ID of the enrollment
  /// @returns Enrollment with progress data
  Future<Map<String, dynamic>> getEnrollmentProgress(
    String enrollmentId,
  ) async {
    final response = await _apiClient.get(
      ApiEndpoints.enrollmentProgress(enrollmentId),
    );
    return response.data;
  }

  /// Fetches course enrollments with progress (for instructors)
  /// @param courseId - The course ID
  /// @returns Enrollments with progress data
  Future<Map<String, dynamic>> getCourseEnrollmentsWithProgress(
    String courseId,
  ) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.enrollments}/course/$courseId/progress',
    );
    return response.data;
  }
}
