import 'package:flutter/foundation.dart';
import '../../Service/Instructor/instructor_service.dart';
import '../../core/api/api_client.dart';

/// Instructor ViewModel
/// Manages instructor-specific state and operations
class InstructorViewModel extends ChangeNotifier {
  final InstructorService _instructorService = InstructorService();

  // State
  Map<String, dynamic>? _dashboard;
  List<Map<String, dynamic>> _courses = [];
  Map<String, dynamic>? _stats;
  Map<String, dynamic>? _earnings;
  List<Map<String, dynamic>> _students = [];
  Map<String, dynamic>? _revenueOverview;
  List<Map<String, dynamic>> _coursePerformance = [];
  final Map<String, Map<String, dynamic>> _coursePerformanceDetails = {};
  List<Map<String, dynamic>> _revenueTrends = [];
  List<Map<String, dynamic>> _recentActivity = [];
  final Map<String, List<Map<String, dynamic>>> _courseStudentProgress = {};
  bool _isLoading = false;
  String? _error;

  // Getters
  Map<String, dynamic>? get dashboard => _dashboard;
  List<Map<String, dynamic>> get courses => _courses;
  Map<String, dynamic>? get stats => _stats;
  Map<String, dynamic>? get earnings => _earnings;
  List<Map<String, dynamic>> get students => _students;
    Map<String, dynamic>? get revenueOverview => _revenueOverview;
    List<Map<String, dynamic>> get coursePerformance => _coursePerformance;
    Map<String, dynamic>? coursePerformanceDetail(String courseId) =>
      _coursePerformanceDetails[courseId];
    List<Map<String, dynamic>> get revenueTrends => _revenueTrends;
    List<Map<String, dynamic>> get recentActivity => _recentActivity;
    List<Map<String, dynamic>>? studentProgressForCourse(String courseId) =>
      _courseStudentProgress[courseId];
  bool get isLoading => _isLoading;
  String? get error => _error;

  // ========== Dashboard Operations ==========

  /// Fetch instructor dashboard
  Future<void> fetchDashboard() async {
    _setLoading(true);
    _clearError();

    try {
      _dashboard = await _instructorService.getInstructorDashboard();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  // ========== Course Operations ==========

  /// Fetch instructor courses
  Future<void> fetchCourses() async {
    _setLoading(true);
    _clearError();

    try {
      _courses = await _instructorService.getInstructorCourses();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  // ========== Stats Operations ==========

  /// Fetch instructor stats
  Future<void> fetchStats() async {
    _setLoading(true);
    _clearError();

    try {
      _stats = await _instructorService.getInstructorStats();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  // ========== Earnings Operations ==========

  /// Fetch instructor earnings
  Future<void> fetchEarnings() async {
    _setLoading(true);
    _clearError();

    try {
      _earnings = await _instructorService.getInstructorRevenue();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  // ========== Student Operations ==========

  /// Fetch instructor students
  Future<void> fetchStudents() async {
    _setLoading(true);
    _clearError();

    try {
      _students = await _instructorService.getInstructorStudents();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch revenue overview (aggregated)
  Future<void> fetchRevenueOverview({bool forceRefresh = false}) async {
    if (_revenueOverview != null && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      _revenueOverview =
          Map<String, dynamic>.from(await _instructorService.getRevenueOverview());
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch course performance summary across courses
  Future<void> fetchCoursePerformance({bool forceRefresh = false}) async {
    if (_coursePerformance.isNotEmpty && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      _coursePerformance = await _instructorService.getCoursePerformance();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch detailed course performance with student progress
  Future<Map<String, dynamic>?> fetchCoursePerformanceDetailed({
    String? courseId,
    bool forceRefresh = false,
  }) async {
    if (courseId != null && _coursePerformanceDetails.containsKey(courseId) && !forceRefresh) {
      return _coursePerformanceDetails[courseId];
    }

    _setLoading(true);
    _clearError();

    try {
      final response = await _instructorService.getCoursePerformanceDetailed(
        courseId: courseId,
      );
      final parsed = Map<String, dynamic>.from(response);
      if (courseId != null) {
        _coursePerformanceDetails[courseId] = parsed;
        final students = parsed['students'];
        if (students is List) {
          _courseStudentProgress[courseId] = students
              .whereType<Map>()
              .map((item) => Map<String, dynamic>.from(item))
              .toList();
        }
      } else {
        final courses = parsed['courses'];
        if (courses is List) {
          _coursePerformance = courses
              .whereType<Map>()
              .map((item) => Map<String, dynamic>.from(item))
              .toList();
        }
      }
      notifyListeners();
      return parsed;
    } on ApiException catch (e) {
      _setError(e.message);
      return null;
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch revenue trends over time
  Future<void> fetchRevenueTrends({bool forceRefresh = false}) async {
    if (_revenueTrends.isNotEmpty && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      _revenueTrends = await _instructorService.getInstructorRevenueTrends();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch recent instructor activity feed
  Future<void> fetchRecentActivity({int limit = 10, bool forceRefresh = false}) async {
    if (_recentActivity.isNotEmpty && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      _recentActivity = await _instructorService.getInstructorActivity(limit: limit);
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch detailed student progress for a course
  Future<List<Map<String, dynamic>>?> fetchStudentProgressForCourse(
    String courseId, {
    bool forceRefresh = false,
  }) async {
    if (_courseStudentProgress.containsKey(courseId) && !forceRefresh) {
      return _courseStudentProgress[courseId];
    }

    _setLoading(true);
    _clearError();

    try {
      final students = await _instructorService.getStudentProgressForCourse(courseId);
      final parsed = students
          .whereType<Map>()
          .map((item) => Map<String, dynamic>.from(item))
          .toList();
      _courseStudentProgress[courseId] = parsed;
      notifyListeners();
      return parsed;
    } on ApiException catch (e) {
      _setError(e.message);
      return null;
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

  /// Refresh all instructor data
  Future<void> refreshAll() async {
    await Future.wait([
      fetchDashboard(),
      fetchCourses(),
      fetchStats(),
      fetchEarnings(),
      fetchStudents(),
      fetchRevenueOverview(forceRefresh: true),
      fetchCoursePerformance(forceRefresh: true),
      fetchRevenueTrends(forceRefresh: true),
      fetchRecentActivity(forceRefresh: true),
    ]);
  }

  /// Clear all state
  void clear() {
    _dashboard = null;
    _courses = [];
    _stats = null;
    _earnings = null;
    _students = [];
    _revenueOverview = null;
    _coursePerformance = [];
    _coursePerformanceDetails.clear();
    _revenueTrends = [];
    _recentActivity = [];
    _courseStudentProgress.clear();
    _isLoading = false;
    _error = null;
    notifyListeners();
  }
}
