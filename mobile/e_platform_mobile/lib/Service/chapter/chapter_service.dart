import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Chapter Service
/// Handles all chapter-related API calls
class ChapterService {
  final ApiClient _apiClient = ApiClient();

  /// Get chapter by ID
  Future<Map<String, dynamic>> getChapterById(String chapterId) async {
    final response = await _apiClient.get(
      ApiEndpoints.chapterById(chapterId),
    );
    return response.data;
  }

  /// Get chapters by course
  Future<List<Map<String, dynamic>>> getChaptersByCourse(
    String courseId,
  ) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.chapters}/course/$courseId',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Create chapter (instructor only)
  Future<Map<String, dynamic>> createChapter(
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.chapters,
      data: data,
    );
    return response.data;
  }

  /// Update chapter (instructor only)
  Future<Map<String, dynamic>> updateChapter(
    String chapterId,
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.put(
      ApiEndpoints.chapterById(chapterId),
      data: data,
    );
    return response.data;
  }

  /// Delete chapter (instructor only)
  Future<void> deleteChapter(String chapterId) async {
    await _apiClient.delete(ApiEndpoints.chapterById(chapterId));
  }

  /// Reorder chapters (instructor only)
  Future<void> reorderChapters(
    String courseId,
    List<String> chapterIds,
  ) async {
    await _apiClient.put(
      '${ApiEndpoints.chapters}/course/$courseId/reorder',
      data: {'chapterIds': chapterIds},
    );
  }
}
