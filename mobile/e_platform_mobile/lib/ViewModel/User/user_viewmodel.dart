import 'package:flutter/foundation.dart';
import '../../Service/User/user_service.dart';
import '../../core/api/api_client.dart';

/// User ViewModel
/// Manages user state and operations
class UserViewModel extends ChangeNotifier {
  final UserService _userService = UserService();

  // State
  Map<String, dynamic>? _currentUserProfile;
  List<Map<String, dynamic>> _users = [];
  bool _isLoading = false;
  String? _error;

  // Getters
  Map<String, dynamic>? get currentUserProfile => _currentUserProfile;
  List<Map<String, dynamic>> get users => _users;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // ========== User Profile Operations ==========

  /// Fetch user profile
  Future<void> fetchUserProfile(String userId) async {
    _setLoading(true);
    _clearError();

    try {
      _currentUserProfile = await _userService.getUserProfile(userId);
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch my profile (authenticated user)
  Future<void> fetchMyProfile() async {
    _setLoading(true);
    _clearError();

    try {
      _currentUserProfile = await _userService.getMyProfile();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to fetch profile: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  /// Update user profile
  Future<bool> updateUserProfile(
    String userId,
    Map<String, dynamic> data,
  ) async {
    _setLoading(true);
    _clearError();

    try {
      _currentUserProfile = await _userService.updateUserProfile(userId, data);
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Update my profile (authenticated user)
  Future<bool> updateMyProfile(Map<String, dynamic> data) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _userService.updateMyProfile(data);
      _currentUserProfile = response['profile'] ?? response;
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } catch (e) {
      _setError('Failed to update profile: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Get user by ID
  Future<Map<String, dynamic>?> getUserById(String userId) async {
    _setLoading(true);
    _clearError();

    try {
      final user = await _userService.getUserById(userId);
      return user;
    } on ApiException catch (e) {
      _setError(e.message);
      return null;
    } finally {
      _setLoading(false);
    }
  }

  // ========== Admin Operations ==========

  /// Fetch all users (admin only)
  Future<void> fetchAllUsers({
    int? page,
    int? limit,
    String? role,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      _users = await _userService.getAllUsers(
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

  /// Delete user (admin only)
  Future<bool> deleteUser(String userId) async {
    _setLoading(true);
    _clearError();

    try {
      await _userService.deleteUser(userId);
      _users.removeWhere((user) => user['id'] == userId);
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Approve instructor (admin only)
  Future<bool> approveInstructor(String userId) async {
    _setLoading(true);
    _clearError();

    try {
      final updatedUser = await _userService.approveInstructor(userId);
      final index = _users.indexWhere((user) => user['id'] == userId);
      if (index != -1) {
        _users[index] = updatedUser;
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

  /// Decline instructor (admin only)
  Future<bool> declineInstructor(String userId, String reason) async {
    _setLoading(true);
    _clearError();

    try {
      final updatedUser = await _userService.declineInstructor(userId, reason);
      final index = _users.indexWhere((user) => user['id'] == userId);
      if (index != -1) {
        _users[index] = updatedUser;
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

  // ========== Password Management ==========

  /// Change password
  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      // Note: This would typically call a backend API endpoint
      // For now, we'll use Firebase Auth directly
      throw UnimplementedError('Password change via API not yet implemented');
    } catch (e) {
      _setError(e.toString());
      rethrow;
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

  /// Clear all state
  void clear() {
    _currentUserProfile = null;
    _users = [];
    _isLoading = false;
    _error = null;
    notifyListeners();
  }
}
