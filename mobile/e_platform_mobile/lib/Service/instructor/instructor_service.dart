import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Instructor Service
/// Handles all instructor-related API calls
class InstructorService {
  final ApiClient _apiClient = ApiClient();

  /// Get instructor dashboard
  Future<Map<String, dynamic>> getInstructorDashboard() async {
    final response = await _apiClient.get(
      ApiEndpoints.instructorDashboard,
    );
    return response.data;
  }

  /// Get instructor courses
  Future<List<Map<String, dynamic>>> getInstructorCourses() async {
    final response = await _apiClient.get(
      ApiEndpoints.instructorCourses,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get instructor stats
  Future<Map<String, dynamic>> getInstructorStats() async {
    final response = await _apiClient.get(
      ApiEndpoints.instructorStats,
    );
    return response.data;
  }

  /// Get instructor earnings
  Future<Map<String, dynamic>> getInstructorEarnings() async {
    final response = await _apiClient.get(
      '${ApiEndpoints.instructorStats}/earnings',
    );
    return response.data;
  }

  /// Get students enrolled in instructor's courses
  Future<List<Map<String, dynamic>>> getInstructorStudents() async {
    final response = await _apiClient.get(
      ApiEndpoints.instructorStudents,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  // ========== ORCHESTRATOR METHODS (Cross-Module Operations) ==========

  /// Get revenue overview (ORCHESTRATOR)
  /// Cross-module: Instructor module (aggregation)
  /// Returns revenue data combined with trends
  Future<Map<String, dynamic>> getRevenueOverview() async {
    final response = await _apiClient.get(
      ApiEndpoints.instructorRevenueOverview,
    );
    return response.data;
  }

  /// Get course performance (ORCHESTRATOR)
  /// Cross-module: Instructor + Progress modules
  /// Returns performance metrics across all courses
  Future<List<Map<String, dynamic>>> getCoursePerformance() async {
    final response = await _apiClient.get(
      ApiEndpoints.instructorCoursePerformance,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get course performance with detailed progress (ORCHESTRATOR)
  /// Cross-module: Instructor + Progress modules
  /// Returns detailed performance for specific course with student progress
  /// If courseId is provided, returns specific course; otherwise returns all courses
  Future<Map<String, dynamic>> getCoursePerformanceDetailed({String? courseId}) async {
    final url = courseId != null
        ? '${ApiEndpoints.instructorCoursePerformanceDetailed}?courseId=$courseId'
        : ApiEndpoints.instructorCoursePerformanceDetailed;
    
    final response = await _apiClient.get(url);
    return response.data;
  }

  /// Get instructor revenue (DIRECT)
  /// Single module operation
  Future<Map<String, dynamic>> getRevenue() async {
    final response = await _apiClient.get(
      ApiEndpoints.instructorRevenue,
    );
    return response.data;
  }

  /// Get instructor revenue trends (DIRECT)
  /// Single module operation
  Future<List<Map<String, dynamic>>> getRevenueTrends() async {
    final response = await _apiClient.get(
      ApiEndpoints.instructorRevenueTrends,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get instructor recent activity (DIRECT)
  /// Single module operation
  Future<List<Map<String, dynamic>>> getRecentActivity({int limit = 10}) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.instructorActivity}?limit=$limit',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get student progress for specific course (DIRECT)
  /// Single module operation
  Future<Map<String, dynamic>> getStudentProgressForCourse(String courseId) async {
    final response = await _apiClient.get(
      ApiEndpoints.instructorCourseStudentsProgress(courseId),
    );
    return response.data;
  }

  /// Get instructor courses (DIRECT)
  /// Single module operation
  Future<List<Map<String, dynamic>>> getCourses() async {
    final response = await _apiClient.get(
      ApiEndpoints.instructorCourses,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get instructor students (DIRECT)
  /// Single module operation
  Future<List<Map<String, dynamic>>> getStudents() async {
    final response = await _apiClient.get(
      ApiEndpoints.instructorStudents,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get instructor stats (DIRECT)
  /// Single module operation
  Future<Map<String, dynamic>> getStats() async {
    final response = await _apiClient.get(
      ApiEndpoints.instructorStats,
    );
    return response.data;
  }

  // Legacy aliases for backward compatibility
  @Deprecated('Use getRevenue() instead')
  Future<Map<String, dynamic>> getInstructorRevenue() => getRevenue();
  
  @Deprecated('Use getRevenueTrends() instead')
  Future<List<Map<String, dynamic>>> getInstructorRevenueTrends() => getRevenueTrends();
  
  @Deprecated('Use getRecentActivity() instead')
  Future<List<Map<String, dynamic>>> getInstructorActivity({int limit = 10}) => getRecentActivity(limit: limit);
}
