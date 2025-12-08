import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../core/auth/auth_service.dart';

/// Auth ViewModel
/// Manages authentication state and operations
class AuthViewModel extends ChangeNotifier {
  final AuthService _authService = AuthService();

  // State
  User? _currentUser;
  Map<String, dynamic>? _customClaims;
  String? _userRole;
  bool _isLoading = false;
  String? _error;

  // Getters
  User? get currentUser => _currentUser;
  Map<String, dynamic>? get customClaims => _customClaims;
  String? get userRole => _userRole;
  bool get isAuthenticated => _currentUser != null;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Role checks
  bool get isStudent => _userRole == 'student';
  bool get isInstructor => _userRole == 'instructor';
  bool get isAdmin => _userRole == 'admin';

  AuthViewModel() {
    _initAuthListener();
  }

  /// Initialize auth state listener
  void _initAuthListener() {
    _authService.authStateChanges.listen((user) async {
      _currentUser = user;
      if (user != null) {
        await _loadUserRole();
      } else {
        _customClaims = null;
        _userRole = null;
      }
      notifyListeners();
    });
  }

  /// Load user role from custom claims
  Future<void> _loadUserRole() async {
    _customClaims = await _authService.getCustomClaims();
    _userRole = _customClaims?['role'] as String?;
    notifyListeners();
  }

  // ========== Authentication Operations ==========

  /// Sign in with email and password
  Future<bool> signIn(String email, String password) async {
    _setLoading(true);
    _clearError();

    try {
      await _authService.signInWithEmailPassword(
        email: email,
        password: password,
      );
      await _loadUserRole();
      return true;
    } on AuthException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Sign up with email and password
  Future<bool> signUp(String email, String password) async {
    _setLoading(true);
    _clearError();

    try {
      await _authService.signUpWithEmailPassword(
        email: email,
        password: password,
      );
      await _loadUserRole();
      return true;
    } on AuthException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Sign out
  Future<void> signOut() async {
    _setLoading(true);
    _clearError();

    try {
      await _authService.logout();
      _currentUser = null;
      _customClaims = null;
      _userRole = null;
      notifyListeners();
    } catch (e) {
      _setError('Failed to sign out');
    } finally {
      _setLoading(false);
    }
  }

  /// Send password reset email
  Future<bool> sendPasswordResetEmail(String email) async {
    _setLoading(true);
    _clearError();

    try {
      await _authService.sendPasswordResetEmail(email);
      return true;
    } on AuthException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Update password
  Future<bool> updatePassword(String newPassword) async {
    _setLoading(true);
    _clearError();

    try {
      await _authService.updatePassword(newPassword);
      return true;
    } on AuthException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Update email
  Future<bool> updateEmail(String newEmail) async {
    _setLoading(true);
    _clearError();

    try {
      await _authService.updateEmail(newEmail);
      return true;
    } on AuthException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Reload user data
  Future<void> reloadUser() async {
    await _authService.reloadUser();
    await _loadUserRole();
  }

  /// Get ID token
  Future<String?> getIdToken({bool forceRefresh = false}) async {
    return await _authService.getIdToken(forceRefresh: forceRefresh);
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

  /// Clear error message
  void clearError() {
    _clearError();
  }

  @override
  void dispose() {
    _authService.dispose();
    super.dispose();
  }
}
