import 'package:flutter/foundation.dart';
import '../../Service/Admin/admin_service.dart';
import '../../core/api/api_client.dart';

/// Admin ViewModel
/// Manages admin-specific state and operations
class AdminViewModel extends ChangeNotifier {
  final AdminService _adminService = AdminService();

  // State
  Map<String, dynamic>? _dashboard;
  Map<String, dynamic>? _stats;
  List<Map<String, dynamic>> _users = [];
  List<Map<String, dynamic>> _courses = [];
  Map<String, dynamic>? _revenue;
  List<Map<String, dynamic>> _activity = [];
  List<Map<String, dynamic>> _coursePerformance = [];
  Map<String, dynamic>? _userEngagement;
  List<Map<String, dynamic>> _activePromotions = [];
  List<Map<String, dynamic>> _subscriptionPlans = [];
  Map<String, dynamic>? _subscriptionStats;
  bool _isLoading = false;
  String? _error;

  // Getters
  Map<String, dynamic>? get dashboard => _dashboard;
  Map<String, dynamic>? get stats => _stats;
  List<Map<String, dynamic>> get users => _users;
  List<Map<String, dynamic>> get courses => _courses;
  Map<String, dynamic>? get revenue => _revenue;
  List<Map<String, dynamic>> get activity => _activity;
  List<Map<String, dynamic>> get coursePerformance => _coursePerformance;
  Map<String, dynamic>? get userEngagement => _userEngagement;
  List<Map<String, dynamic>> get activePromotions => _activePromotions;
  List<Map<String, dynamic>> get subscriptionPlans => _subscriptionPlans;
  Map<String, dynamic>? get subscriptionStats => _subscriptionStats;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // ========== Dashboard Operations ==========

  /// Fetch admin dashboard
  Future<void> fetchDashboard() async {
    _setLoading(true);
    _clearError();

    try {
      _dashboard = await _adminService.getAdminDashboard();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  // ========== Stats Operations ==========

  /// Fetch admin stats
  Future<void> fetchStats() async {
    _setLoading(true);
    _clearError();

    try {
      _stats = await _adminService.getAdminStats();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  // ========== User Management ==========

  /// Fetch all users
  Future<void> fetchUsers({
    int? page,
    int? limit,
    String? role,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      _users = await _adminService.getAllUsers(
        page: page,
        limit: limit,
        role: role,
      );
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Ban user
  Future<bool> banUser(String userId) async {
    _setLoading(true);
    _clearError();

    try {
      await _adminService.banUser(userId);
      final index = _users.indexWhere((u) => u['id'] == userId);
      if (index != -1) {
        _users[index]['banned'] = true;
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

  /// Unban user
  Future<bool> unbanUser(String userId) async {
    _setLoading(true);
    _clearError();

    try {
      await _adminService.unbanUser(userId);
      final index = _users.indexWhere((u) => u['id'] == userId);
      if (index != -1) {
        _users[index]['banned'] = false;
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

  // ========== Course Management ==========

  /// Fetch all courses
  Future<void> fetchCourses({
    int? page,
    int? limit,
    String? status,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      _courses = await _adminService.getAllCourses(
        page: page,
        limit: limit,
        status: status,
      );
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch revenue analytics
  Future<void> fetchRevenue({bool forceRefresh = false}) async {
    if (_revenue != null && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      _revenue = await _adminService.getRevenue();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch recent platform activity
  Future<void> fetchActivity({int limit = 10, bool forceRefresh = false}) async {
    if (_activity.isNotEmpty && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      _activity = await _adminService.getRecentActivity(limit: limit);
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch course performance analytics
  Future<void> fetchCoursePerformance({bool forceRefresh = false}) async {
    if (_coursePerformance.isNotEmpty && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      _coursePerformance = await _adminService.getCoursePerformance();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch user engagement metrics
  Future<void> fetchUserEngagement({bool forceRefresh = false}) async {
    if (_userEngagement != null && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      _userEngagement = await _adminService.getUserEngagement();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch active promotions
  Future<void> fetchActivePromotions({bool forceRefresh = false}) async {
    if (_activePromotions.isNotEmpty && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      _activePromotions = await _adminService.getActivePromotions();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Create a new promotion
  Future<bool> createPromotion(Map<String, dynamic> promotionData) async {
    _setLoading(true);
    _clearError();

    try {
      final created = await _adminService.createPromotion(promotionData);
      _activePromotions.insert(0, Map<String, dynamic>.from(created));
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch subscription plans
  Future<void> fetchSubscriptionPlans({bool forceRefresh = false}) async {
    if (_subscriptionPlans.isNotEmpty && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      _subscriptionPlans = await _adminService.getSubscriptionPlans();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch subscription statistics
  Future<void> fetchSubscriptionStats({bool forceRefresh = false}) async {
    if (_subscriptionStats != null && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      _subscriptionStats = await _adminService.getSubscriptionStats();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Update subscription plan
  Future<bool> updateSubscriptionPlan(
    String planId,
    Map<String, dynamic> data,
  ) async {
    _setLoading(true);
    _clearError();

    try {
      final updated = await _adminService.updateSubscriptionPlan(planId, data);
      final index = _subscriptionPlans.indexWhere((plan) => plan['id'] == planId);
      if (index != -1) {
        _subscriptionPlans[index] = Map<String, dynamic>.from(updated);
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

  /// Approve course
  Future<bool> approveCourse(String courseId) async {
    _setLoading(true);
    _clearError();

    try {
      await _adminService.approveCourse(courseId);
      final index = _courses.indexWhere((c) => c['id'] == courseId);
      if (index != -1) {
        _courses[index]['status'] = 'approved';
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

  /// Reject course
  Future<bool> rejectCourse(String courseId, String reason) async {
    _setLoading(true);
    _clearError();

    try {
      await _adminService.rejectCourse(courseId, reason);
      final index = _courses.indexWhere((c) => c['id'] == courseId);
      if (index != -1) {
        _courses[index]['status'] = 'rejected';
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

  /// Refresh all admin data
  Future<void> refreshAll() async {
    await Future.wait([
      fetchDashboard(),
      fetchStats(),
      fetchUsers(),
      fetchCourses(),
      fetchRevenue(forceRefresh: true),
      fetchActivity(forceRefresh: true),
      fetchCoursePerformance(forceRefresh: true),
      fetchUserEngagement(forceRefresh: true),
      fetchActivePromotions(forceRefresh: true),
      fetchSubscriptionPlans(forceRefresh: true),
      fetchSubscriptionStats(forceRefresh: true),
    ]);
  }

  /// Clear all state
  void clear() {
    _dashboard = null;
    _stats = null;
    _users = [];
    _courses = [];
    _revenue = null;
    _activity = [];
    _coursePerformance = [];
    _userEngagement = null;
    _activePromotions = [];
    _subscriptionPlans = [];
    _subscriptionStats = null;
    _isLoading = false;
    _error = null;
    notifyListeners();
  }
}
