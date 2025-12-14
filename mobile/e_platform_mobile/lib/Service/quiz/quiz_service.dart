import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Quiz Service
/// Handles all quiz-related API calls
class QuizService {
  final ApiClient _apiClient = ApiClient();

  /// Get quiz by ID
  Future<Map<String, dynamic>> getQuizById(String quizId) async {
    final response = await _apiClient.get(
      ApiEndpoints.quizById(quizId),
    );
    return response.data;
  }

  /// Submit quiz answers
  Future<Map<String, dynamic>> submitQuiz(
    String quizId,
    Map<String, dynamic> answers,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.quizSubmit(quizId),
      data: answers,
    );
    return response.data;
  }

  /// Get quiz attempts
  Future<List<Map<String, dynamic>>> getQuizAttempts(String quizId) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.quizById(quizId)}/attempts',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get quiz results
  Future<Map<String, dynamic>> getQuizResults(
    String quizId,
    String attemptId,
  ) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.quizById(quizId)}/attempts/$attemptId',
    );
    return response.data;
  }

  /// Create quiz (instructor only)
  Future<Map<String, dynamic>> createQuiz(Map<String, dynamic> data) async {
    final response = await _apiClient.post(
      ApiEndpoints.quizzes,
      data: data,
    );
    return response.data;
  }

  /// Update quiz (instructor only)
  Future<Map<String, dynamic>> updateQuiz(
    String quizId,
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.put(
      ApiEndpoints.quizById(quizId),
      data: data,
    );
    return response.data;
  }

  /// Delete quiz (instructor only)
  Future<void> deleteQuiz(String quizId) async {
    await _apiClient.delete(ApiEndpoints.quizById(quizId));
  }

  /// Get all quizzes
  Future<List<Map<String, dynamic>>> getAllQuizzes() async {
    final response = await _apiClient.get(ApiEndpoints.quizzes);
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get quizzes by course
  Future<List<Map<String, dynamic>>> getQuizzesByCourse(String courseId) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.quizzes}/course/$courseId/list',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get quizzes by lesson
  Future<List<Map<String, dynamic>>> getQuizzesByLesson(String lessonId) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.quizzes}/lesson/$lessonId/list',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }
}
