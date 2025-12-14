import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Progress Service
/// Handles all progress-related API calls
class ProgressService {
  final ApiClient _apiClient = ApiClient();

  /// Get progress by enrollment
  Future<Map<String, dynamic>> getProgressByEnrollment(
    String enrollmentId,
  ) async {
    final response = await _apiClient.get(
      ApiEndpoints.progressByEnrollment(enrollmentId),
    );
    return response.data;
  }

  /// Update progress
  Future<Map<String, dynamic>> updateProgress(
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.progressUpdate,
      data: data,
    );
    return response.data;
  }

  /// Mark lesson as completed
  Future<Map<String, dynamic>> markLessonCompleted(
    String enrollmentId,
    String lessonId,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.progressUpdate,
      data: {
        'enrollmentId': enrollmentId,
        'lessonId': lessonId,
        'completed': true,
      },
    );
    return response.data;
  }

  /// Get overall progress
  Future<Map<String, dynamic>> getOverallProgress() async {
    final response = await _apiClient.get(
      ApiEndpoints.progress,
    );
    return response.data;
  }

  /// Get progress stats
  Future<Map<String, dynamic>> getProgressStats(
    String enrollmentId,
  ) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.progressByEnrollment(enrollmentId)}/stats',
    );
    return response.data;
  }

  // ========== ORCHESTRATOR METHODS (Item Completion) ==========

  /// Mark item as completed (ORCHESTRATOR)
  /// Marks specific item (lesson/quiz) as completed
  /// Cross-module: Progress + Enrollment modules
  Future<Map<String, dynamic>> markItemCompleted(
    String progressId,
    String itemId,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.progressCompleteItem(progressId),
      data: {'itemId': itemId},
    );
    return response.data;
  }

  /// Get progress by ID (DIRECT)
  /// Single module operation
  Future<Map<String, dynamic>> getProgressById(String progressId) async {
    final response = await _apiClient.get(
      ApiEndpoints.progressById(progressId),
    );
    return response.data;
  }

  /// Get my progress (DIRECT)
  /// Single module operation - gets all progress for current user
  Future<List<Map<String, dynamic>>> getMyProgress() async {
    final response = await _apiClient.get(
      ApiEndpoints.myProgress,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get progress by course (DIRECT)
  /// Single module operation - gets progress summary for specific course
  Future<Map<String, dynamic>> getProgressByCourse(String courseId) async {
    final response = await _apiClient.get(
      ApiEndpoints.progressByCourse(courseId),
    );
    return response.data;
  }

  /// Get or create progress (DIRECT)
  /// Initializes or retrieves progress for a module
  Future<Map<String, dynamic>> getOrCreateProgress(
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.progress,
      data: data,
    );
    return response.data;
  }

  /// Get user course progress summary (DIRECT)
  /// Returns summary of progress for a specific course
  Future<Map<String, dynamic>> getUserCourseProgressSummary(
    String courseId,
  ) async {
    final response = await _apiClient.get(
      ApiEndpoints.progressByCourse(courseId),
    );
    return response.data;
  }

  /// Update progress by ID (DIRECT)
  /// Updates specific progress record
  Future<Map<String, dynamic>> updateProgressById(
    String progressId,
    Map<String, dynamic> updateData,
  ) async {
    final response = await _apiClient.patch(
      ApiEndpoints.progressById(progressId),
      data: updateData,
    );
    return response.data;
  }

  /// Get progress by module (DIRECT)
  /// Instructor view - get progress for specific module
  Future<List<Map<String, dynamic>>> getProgressByModule(
    String moduleType,
    String moduleId,
  ) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.progress}/module/$moduleType/$moduleId',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Delete progress (admin only)
  Future<void> deleteProgress(String progressId) async {
    await _apiClient.delete(ApiEndpoints.progressById(progressId));
  }
}
