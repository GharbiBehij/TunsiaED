import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Lesson Service
/// Handles all lesson-related API calls
class LessonService {
  final ApiClient _apiClient = ApiClient();

  /// Get lesson by ID
  Future<Map<String, dynamic>> getLessonById(String lessonId) async {
    final response = await _apiClient.get(
      ApiEndpoints.lessonById(lessonId),
    );
    return response.data;
  }

  /// Get lessons by chapter
  Future<List<Map<String, dynamic>>> getLessonsByChapter(
    String chapterId,
  ) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.lessons}/chapter/$chapterId',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Create lesson (instructor only)
  Future<Map<String, dynamic>> createLesson(Map<String, dynamic> data) async {
    final response = await _apiClient.post(
      ApiEndpoints.lessons,
      data: data,
    );
    return response.data;
  }

  /// Update lesson (instructor only)
  Future<Map<String, dynamic>> updateLesson(
    String lessonId,
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.put(
      ApiEndpoints.lessonById(lessonId),
      data: data,
    );
    return response.data;
  }

  /// Delete lesson (instructor only)
  Future<void> deleteLesson(String lessonId) async {
    await _apiClient.delete(ApiEndpoints.lessonById(lessonId));
  }

  /// Reorder lessons (instructor only)
  Future<void> reorderLessons(
    String chapterId,
    List<String> lessonIds,
  ) async {
    await _apiClient.put(
      '${ApiEndpoints.lessons}/chapter/$chapterId/reorder',
      data: {'lessonIds': lessonIds},
    );
  }

  /// Get lessons by course
  Future<List<Map<String, dynamic>>> getLessonsByCourse(String courseId) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.lessons}/course/$courseId/list',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }
}
