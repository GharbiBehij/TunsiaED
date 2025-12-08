import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Course Service
/// Handles all course-related API calls
class CourseService {
  final ApiClient _apiClient = ApiClient();

  /// Get all courses
  Future<List<Map<String, dynamic>>> getAllCourses({
    int? page,
    int? limit,
    String? category,
    String? search,
  }) async {
    final response = await _apiClient.get(
      ApiEndpoints.courses,
      queryParameters: {
        if (page != null) 'page': page,
        if (limit != null) 'limit': limit,
        if (category != null) 'category': category,
        if (search != null) 'search': search,
      },
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get course by ID
  Future<Map<String, dynamic>> getCourseById(String courseId) async {
    final response = await _apiClient.get(
      ApiEndpoints.courseById(courseId),
    );
    return response.data;
  }

  /// Get course content (chapters, lessons)
  Future<Map<String, dynamic>> getCourseContent(String courseId) async {
    final response = await _apiClient.get(
      ApiEndpoints.courseContent(courseId),
    );
    return response.data;
  }

  /// Create course (instructor only)
  Future<Map<String, dynamic>> createCourse(Map<String, dynamic> data) async {
    final response = await _apiClient.post(
      ApiEndpoints.courses,
      data: data,
    );
    return response.data;
  }

  /// Update course (instructor only)
  Future<Map<String, dynamic>> updateCourse(
    String courseId,
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.put(
      ApiEndpoints.courseById(courseId),
      data: data,
    );
    return response.data;
  }

  /// Delete course (instructor/admin only)
  Future<void> deleteCourse(String courseId) async {
    await _apiClient.delete(ApiEndpoints.courseById(courseId));
  }

  /// Enroll in course
  Future<Map<String, dynamic>> enrollInCourse(String courseId) async {
    final response = await _apiClient.post(
      ApiEndpoints.courseEnroll(courseId),
    );
    return response.data;
  }

  /// Publish course (instructor only)
  Future<Map<String, dynamic>> publishCourse(String courseId) async {
    final response = await _apiClient.patch(
      ApiEndpoints.courseById(courseId),
      data: {'status': 'published'},
    );
    return response.data;
  }

  /// Unpublish course (instructor only)
  Future<Map<String, dynamic>> unpublishCourse(String courseId) async {
    final response = await _apiClient.patch(
      ApiEndpoints.courseById(courseId),
      data: {'status': 'draft'},
    );
    return response.data;
  }

  /// Get instructor courses (instructor only)
  Future<List<Map<String, dynamic>>> getInstructorCourses() async {
    final response = await _apiClient.get(
      '${ApiEndpoints.courses}/instructor/my-courses',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get courses by category
  Future<List<Map<String, dynamic>>> getCoursesByCategory(String category) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.courses}/category/$category',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get all categories
  Future<List<String>> getAllCategories() async {
    final response = await _apiClient.get(
      '${ApiEndpoints.courses}/categories',
    );
    return List<String>.from(response.data);
  }

  /// Get system courses
  Future<List<Map<String, dynamic>>> getSystemCourses() async {
    final response = await _apiClient.get(
      '${ApiEndpoints.courses}/system',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }
}
