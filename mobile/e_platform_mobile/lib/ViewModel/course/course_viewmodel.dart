import 'package:flutter/foundation.dart';
import '../../Service/Course/course_service.dart';
import '../../core/api/api_client.dart';

/// Course ViewModel
/// Manages course state and operations
class CourseViewModel extends ChangeNotifier {
  final CourseService _courseService = CourseService();

  // State
  List<Map<String, dynamic>> _courses = [];
  Map<String, dynamic>? _selectedCourse;
  Map<String, dynamic>? _courseContent;
  bool _isLoading = false;
  String? _error;

  // Getters
  List<Map<String, dynamic>> get courses => _courses;
  Map<String, dynamic>? get selectedCourse => _selectedCourse;
  Map<String, dynamic>? get courseContent => _courseContent;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // ========== Course Operations ==========

  /// Fetch all courses
  Future<void> fetchCourses({
    int? page,
    int? limit,
    String? category,
    String? search,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      _courses = await _courseService.getAllCourses(
        page: page,
        limit: limit,
        category: category,
        search: search,
      );
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch course by ID
  Future<void> fetchCourseById(String courseId) async {
    _setLoading(true);
    _clearError();

    try {
      _selectedCourse = await _courseService.getCourseById(courseId);
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch course content
  Future<void> fetchCourseContent(String courseId) async {
    _setLoading(true);
    _clearError();

    try {
      _courseContent = await _courseService.getCourseContent(courseId);
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Enroll in course
  Future<bool> enrollInCourse(String courseId) async {
    _setLoading(true);
    _clearError();

    try {
      await _courseService.enrollInCourse(courseId);
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // ========== Instructor Operations ==========

  /// Create course (instructor only)
  Future<bool> createCourse(Map<String, dynamic> data) async {
    _setLoading(true);
    _clearError();

    try {
      final newCourse = await _courseService.createCourse(data);
      _courses.insert(0, newCourse);
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Update course (instructor only)
  Future<bool> updateCourse(String courseId, Map<String, dynamic> data) async {
    _setLoading(true);
    _clearError();

    try {
      final updatedCourse = await _courseService.updateCourse(courseId, data);
      final index = _courses.indexWhere((c) => c['id'] == courseId);
      if (index != -1) {
        _courses[index] = updatedCourse;
      }
      if (_selectedCourse?['id'] == courseId) {
        _selectedCourse = updatedCourse;
      }
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Delete course (instructor only)
  Future<bool> deleteCourse(String courseId) async {
    _setLoading(true);
    _clearError();

    try {
      await _courseService.deleteCourse(courseId);
      _courses.removeWhere((c) => c['id'] == courseId);
      if (_selectedCourse?['id'] == courseId) {
        _selectedCourse = null;
      }
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Publish course
  Future<bool> publishCourse(String courseId) async {
    _setLoading(true);
    _clearError();

    try {
      final updatedCourse = await _courseService.publishCourse(courseId);
      final index = _courses.indexWhere((c) => c['id'] == courseId);
      if (index != -1) {
        _courses[index] = updatedCourse;
      }
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Unpublish course
  Future<bool> unpublishCourse(String courseId) async {
    _setLoading(true);
    _clearError();

    try {
      final updatedCourse = await _courseService.unpublishCourse(courseId);
      final index = _courses.indexWhere((c) => c['id'] == courseId);
      if (index != -1) {
        _courses[index] = updatedCourse;
      }
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
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

  /// Clear selected course
  void clearSelectedCourse() {
    _selectedCourse = null;
    _courseContent = null;
    notifyListeners();
  }

  /// Clear all state
  void clear() {
    _courses = [];
    _selectedCourse = null;
    _courseContent = null;
    _isLoading = false;
    _error = null;
    notifyListeners();
  }
}
