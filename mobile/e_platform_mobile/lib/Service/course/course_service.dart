import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Course Service
/// Handles all course-related API calls
/// Follows exact web architecture
class CourseService {
  final ApiClient _apiClient = ApiClient();

  /// Fetches all available courses
  /// @returns List of all courses
  Future<List<Map<String, dynamic>>> getAllCourses() async {
    final response = await _apiClient.get(ApiEndpoints.courses);
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Fetches a specific course by ID
  /// @param courseId - The ID of the course
  /// @returns Course data
  Future<Map<String, dynamic>> getCourseById(String courseId) async {
    final response = await _apiClient.get(
      ApiEndpoints.courseById(courseId),
    );
    return response.data;
  }

  /// Fetches courses by category
  /// @param category - The category name
  /// @returns List of courses in the category
  Future<List<Map<String, dynamic>>> getCoursesByCategory(String category) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.courses}/category/$category',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Fetches system courses (platform-seeded courses)
  /// @returns List of system courses
  Future<List<Map<String, dynamic>>> getSystemCourses() async {
    final response = await _apiClient.get(
      '${ApiEndpoints.courses}/system',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Fetches all unique course categories
  /// @returns List of category names
  Future<List<String>> getAllCategories() async {
    final response = await _apiClient.get(
      '${ApiEndpoints.courses}/categories',
    );
    return List<String>.from(response.data);
  }

  /// Creates a new course
  /// @param courseData - Course creation data
  /// @returns Created course data
  Future<Map<String, dynamic>> createCourse(Map<String, dynamic> courseData) async {
    final response = await _apiClient.post(
      ApiEndpoints.courses,
      data: courseData,
    );
    return response.data;
  }

  /// Updates an existing course
  /// @param courseId - The ID of the course to update
  /// @param courseData - Updated course data
  /// @returns Updated course data
  Future<Map<String, dynamic>> updateCourse(
    String courseId,
    Map<String, dynamic> courseData,
  ) async {
    final response = await _apiClient.put(
      ApiEndpoints.courseById(courseId),
      data: courseData,
    );
    return response.data;
  }

  /// Deletes a course
  /// @param courseId - The ID of the course to delete
  /// @returns Deletion confirmation
  Future<void> deleteCourse(String courseId) async {
    await _apiClient.delete(ApiEndpoints.courseById(courseId));
  }
}
