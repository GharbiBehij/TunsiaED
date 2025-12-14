import 'package:flutter/foundation.dart';
import '../../Service/Enrollment/enrollment_service.dart';
import '../../core/api/api_client.dart';

/// Enrollment ViewModel
/// Manages enrollment state and operations
class EnrollmentViewModel extends ChangeNotifier {
  final EnrollmentService _enrollmentService = EnrollmentService();

  // State
  List<Map<String, dynamic>> _enrollments = [];
  Map<String, dynamic>? _selectedEnrollment;
  Map<String, dynamic>? _enrollmentProgress;
  bool _isLoading = false;
  String? _error;

  // Getters
  List<Map<String, dynamic>> get enrollments => _enrollments;
  Map<String, dynamic>? get selectedEnrollment => _selectedEnrollment;
  Map<String, dynamic>? get enrollmentProgress => _enrollmentProgress;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // ========== Enrollment Operations ==========

  /// Fetch all enrollments
  Future<void> fetchEnrollments() async {
    _setLoading(true);
    _clearError();

    try {
      _enrollments = await _enrollmentService.getEnrollments();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch enrollment by ID
  Future<void> fetchEnrollmentById(String enrollmentId) async {
    _setLoading(true);
    _clearError();

    try {
      _selectedEnrollment = await _enrollmentService.getEnrollmentById(enrollmentId);
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch enrollment progress
  Future<void> fetchEnrollmentProgress(String enrollmentId) async {
    _setLoading(true);
    _clearError();

    try {
      _enrollmentProgress = await _enrollmentService.getEnrollmentProgress(enrollmentId);
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Create enrollment
  Future<bool> createEnrollment(Map<String, dynamic> data) async {
    _setLoading(true);
    _clearError();

    try {
      final newEnrollment = await _enrollmentService.createEnrollment(data);
      _enrollments.insert(0, newEnrollment);
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Cancel enrollment
  Future<bool> cancelEnrollment(String enrollmentId) async {
    _setLoading(true);
    _clearError();

    try {
      await _enrollmentService.cancelEnrollment(enrollmentId);
      _enrollments.removeWhere((e) => e['id'] == enrollmentId);
      if (_selectedEnrollment?['id'] == enrollmentId) {
        _selectedEnrollment = null;
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

  /// Fetch enrollments by course (instructor/admin)
  Future<List<Map<String, dynamic>>?> fetchEnrollmentsByCourse(
    String courseId,
  ) async {
    _setLoading(true);
    _clearError();

    try {
      final enrollments = await _enrollmentService.getEnrollmentsByCourse(courseId);
      return enrollments;
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

  /// Clear selected enrollment
  void clearSelectedEnrollment() {
    _selectedEnrollment = null;
    _enrollmentProgress = null;
    notifyListeners();
  }

  /// Clear all state
  void clear() {
    _enrollments = [];
    _selectedEnrollment = null;
    _enrollmentProgress = null;
    _isLoading = false;
    _error = null;
    notifyListeners();
  }
}
