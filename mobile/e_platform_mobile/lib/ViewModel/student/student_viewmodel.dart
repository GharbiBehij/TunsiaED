import 'package:flutter/foundation.dart';
import '../../Service/Student/student_service.dart';
import '../../core/api/api_client.dart';

/// Student ViewModel
/// Manages student-specific state and operations
class StudentViewModel extends ChangeNotifier {
  final StudentService _studentService = StudentService();

  // State
  Map<String, dynamic>? _dashboard;
  List<Map<String, dynamic>> _enrolledCourses = [];
  Map<String, dynamic>? _progress;
  List<Map<String, dynamic>> _certificates = [];
  List<Map<String, dynamic>> _transactions = [];
  List<Map<String, dynamic>> _enrollmentsDetailed = [];
  Map<String, dynamic>? _learningOverview;
  Map<String, dynamic>? _progressOverview;
  final Map<String, Map<String, dynamic>> _enrollmentProgress = {};
  final Map<String, Map<String, dynamic>> _courseProgress = {};
  bool _isLoading = false;
  String? _error;

  // Getters
  Map<String, dynamic>? get dashboard => _dashboard;
  List<Map<String, dynamic>> get enrolledCourses => _enrolledCourses;
  Map<String, dynamic>? get progress => _progress;
    List<Map<String, dynamic>> get certificates => _certificates;
    List<Map<String, dynamic>> get transactions => _transactions;
    List<Map<String, dynamic>> get enrollmentsDetailed => _enrollmentsDetailed;
    Map<String, dynamic>? get learningOverview => _learningOverview;
    Map<String, dynamic>? get progressOverview => _progressOverview;
    Map<String, dynamic>? enrollmentProgress(String enrollmentId) =>
      _enrollmentProgress[enrollmentId];
    Map<String, dynamic>? courseProgress(String courseId) =>
      _courseProgress[courseId];
  bool get isLoading => _isLoading;
  String? get error => _error;

  // ========== Dashboard Operations ==========

  /// Fetch student dashboard
  Future<void> fetchDashboard() async {
    _setLoading(true);
    _clearError();

    try {
      _dashboard = await _studentService.getStudentDashboard();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  // ========== Course Operations ==========

  /// Fetch enrolled courses
  Future<void> fetchEnrolledCourses() async {
    _setLoading(true);
    _clearError();

    try {
      _enrolledCourses = await _studentService.getStudentCourses();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  // ========== Progress Operations ==========

  /// Fetch student progress
  Future<void> fetchProgress() async {
    _setLoading(true);
    _clearError();

    try {
      _progress = await _studentService.getStudentProgress();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch course-specific progress
  Future<Map<String, dynamic>?> fetchCourseProgress(String courseId) async {
    _setLoading(true);
    _clearError();

    try {
      final courseProgress = await _studentService.getProgressByCourse(courseId);
      _courseProgress[courseId] = Map<String, dynamic>.from(courseProgress);
      notifyListeners();
      return courseProgress;
    } on ApiException catch (e) {
      _setError(e.message);
      return null;
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch enrollments merged with progress details (orchestrator)
  Future<void> fetchEnrollmentsWithProgress({bool forceRefresh = false}) async {
    if (_enrollmentsDetailed.isNotEmpty && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      final response = await _studentService.getEnrollmentsWithProgress();
      final enrollments = _extractMapList(response['enrollments'] ?? response);
      _applyEnrollmentsWithProgress(enrollments);
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch comprehensive learning overview (orchestrator)
  Future<void> fetchLearningOverview({bool forceRefresh = false}) async {
    if (_learningOverview != null && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      _learningOverview =
          Map<String, dynamic>.from(await _studentService.getLearningOverview());
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch progress overview across all courses (orchestrator)
  Future<void> fetchProgressOverview({bool forceRefresh = false}) async {
    if (_progressOverview != null && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      _progressOverview = Map<String, dynamic>.from(
        await _studentService.getProgressOverview(),
      );
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch enrollment-specific progress (orchestrator)
  Future<Map<String, dynamic>?> fetchProgressByEnrollment(
    String enrollmentId, {
    bool forceRefresh = false,
  }) async {
    if (_enrollmentProgress.containsKey(enrollmentId) && !forceRefresh) {
      return _enrollmentProgress[enrollmentId];
    }

    _setLoading(true);
    _clearError();

    try {
      final result = await _studentService.getProgressByEnrollment(enrollmentId);
      final parsed = Map<String, dynamic>.from(result);
      _enrollmentProgress[enrollmentId] = parsed;
      notifyListeners();
      return parsed;
    } on ApiException catch (e) {
      _setError(e.message);
      return null;
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch course progress summary (orchestrator)
  Future<Map<String, dynamic>?> fetchProgressByCourse(
    String courseId, {
    bool forceRefresh = false,
  }) async {
    if (_courseProgress.containsKey(courseId) && !forceRefresh) {
      return _courseProgress[courseId];
    }

    _setLoading(true);
    _clearError();

    try {
      final result = await _studentService.getProgressByCourse(courseId);
      final parsed = Map<String, dynamic>.from(result);
      _courseProgress[courseId] = parsed;
      notifyListeners();
      return parsed;
    } on ApiException catch (e) {
      _setError(e.message);
      return null;
    } finally {
      _setLoading(false);
    }
  }

  /// Update progress and keep enrollment in sync (orchestrator)
  Future<bool> updateProgressOrchestrated(
    Map<String, dynamic> progressData,
  ) async {
    _setLoading(true);
    _clearError();

    try {
      final result = await _studentService.updateProgressOrchestrated(progressData);
      final parsedResult = Map<String, dynamic>.from(result);

      final enrollmentId = progressData['enrollmentId']?.toString();
      final courseId = progressData['courseId']?.toString();
      if (enrollmentId != null) {
        _enrollmentProgress[enrollmentId] = parsedResult;
      }
      if (courseId != null) {
        _courseProgress[courseId] = parsedResult;
      }

      await _refreshProgressAggregates();
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // ========== Certificate Operations ==========

  /// Fetch student certificates
  Future<void> fetchCertificates() async {
    _setLoading(true);
    _clearError();

    try {
      _certificates = await _studentService.getStudentCertificates();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  // ========== Transaction Operations ==========

  /// Fetch student transactions
  Future<void> fetchTransactions() async {
    _setLoading(true);
    _clearError();

    try {
      _transactions = await _studentService.getStudentTransactions();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }
  // ========== Helper Methods ==========

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setError(String message) {
    _error = message;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
  }

  List<Map<String, dynamic>> _extractMapList(dynamic value) {
    if (value is List) {
      return value
          .whereType<Map>()
          .map((item) => Map<String, dynamic>.from(item))
          .toList();
    }
    return const [];
  }

  void _applyEnrollmentsWithProgress(List<Map<String, dynamic>> enrollments) {
    _enrollmentsDetailed = enrollments;
    for (final enrollment in enrollments) {
      final enrollmentId = (enrollment['enrollmentId'] ?? enrollment['id'])
          ?.toString();
      final progressDetails = enrollment['progressDetails'];
      if (enrollmentId != null && progressDetails is Map) {
        _enrollmentProgress[enrollmentId] =
            Map<String, dynamic>.from(progressDetails);
      }
    }
  }

  Future<void> _refreshProgressAggregates() async {
    final responses = await Future.wait([
      _studentService.getEnrollmentsWithProgress(),
      _studentService.getProgressOverview(),
      _studentService.getLearningOverview(),
    ]);

    final enrollments =
        _extractMapList(responses[0]['enrollments'] ?? responses[0]);
    _applyEnrollmentsWithProgress(enrollments);
    _progressOverview = Map<String, dynamic>.from(responses[1]);
    _learningOverview = Map<String, dynamic>.from(responses[2]);
  }

  /// Refresh all student data
  Future<void> refreshAll() async {
    await Future.wait([
      fetchDashboard(),
      fetchEnrolledCourses(),
      fetchProgress(),
      fetchCertificates(),
      fetchTransactions(),
      fetchEnrollmentsWithProgress(forceRefresh: true),
      fetchLearningOverview(forceRefresh: true),
      fetchProgressOverview(forceRefresh: true),
    ]);
  }

  /// Clear all state
  void clear() {
    _dashboard = null;
    _enrolledCourses = [];
    _progress = null;
    _certificates = [];
    _transactions = [];
    _enrollmentsDetailed = [];
    _learningOverview = null;
    _progressOverview = null;
    _enrollmentProgress.clear();
    _courseProgress.clear();
    _isLoading = false;
    _error = null;
    notifyListeners();
  }
}
