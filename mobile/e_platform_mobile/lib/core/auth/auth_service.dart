import 'package:firebase_auth/firebase_auth.dart';
import 'dart:async';
import '../config/app_config.dart';

/// Authentication Service
/// Wrapper around Firebase Auth with token management and custom claims
class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  
  // Token cache
  String? _cachedToken;
  DateTime? _tokenExpiryTime;
  Timer? _tokenRefreshTimer;

  // ========== Auth State ==========

  /// Current user stream
  Stream<User?> get authStateChanges => _firebaseAuth.authStateChanges();

  /// Current user
  User? get currentUser => _firebaseAuth.currentUser;

  /// Check if user is authenticated
  bool get isAuthenticated => currentUser != null;

  // ========== Token Management ==========

  /// Get ID token (from cache or Firebase)
  Future<String?> getIdToken({bool forceRefresh = false}) async {
    final user = currentUser;
    if (user == null) return null;

    // Return cached token if valid
    if (!forceRefresh && _cachedToken != null && _isTokenValid()) {
      return _cachedToken;
    }

    // Get fresh token from Firebase
    try {
      final token = await user.getIdToken(forceRefresh);
      _cachedToken = token;
      _tokenExpiryTime = DateTime.now().add(const Duration(minutes: 60));
      return token;
    } catch (e) {
      print('❌ Error getting ID token: $e');
      return null;
    }
  }

  /// Refresh token
  Future<String?> refreshToken() async {
    return await getIdToken(forceRefresh: true);
  }

  /// Check if cached token is still valid
  bool _isTokenValid() {
    if (_tokenExpiryTime == null) return false;
    return DateTime.now().isBefore(_tokenExpiryTime!);
  }

  /// Start automatic token refresh timer
  void _startTokenRefreshTimer() {
    _tokenRefreshTimer?.cancel();
    _tokenRefreshTimer = Timer.periodic(
      AppConfig.tokenRefreshInterval,
      (_) async {
        if (isAuthenticated) {
          await refreshToken();
        }
      },
    );
  }

  /// Stop token refresh timer
  void _stopTokenRefreshTimer() {
    _tokenRefreshTimer?.cancel();
    _tokenRefreshTimer = null;
  }

  // ========== Custom Claims ==========

  /// Get custom claims from ID token
  Future<Map<String, dynamic>?> getCustomClaims() async {
    final user = currentUser;
    if (user == null) return null;

    try {
      final idTokenResult = await user.getIdTokenResult();
      return idTokenResult.claims;
    } catch (e) {
      print('❌ Error getting custom claims: $e');
      return null;
    }
  }

  /// Get user role from custom claims
  Future<String?> getUserRole() async {
    final claims = await getCustomClaims();
    return claims?['role'] as String?;
  }

  /// Check if user has specific role
  Future<bool> hasRole(String role) async {
    final userRole = await getUserRole();
    return userRole == role;
  }

  /// Check if user is instructor
  Future<bool> isInstructor() async {
    return await hasRole('instructor');
  }

  /// Check if user is student
  Future<bool> isStudent() async {
    return await hasRole('student');
  }

  /// Check if user is admin
  Future<bool> isAdmin() async {
    return await hasRole('admin');
  }

  // ========== Authentication Methods ==========

  /// Sign in with email and password
  Future<UserCredential> signInWithEmailPassword({
    required String email,
    required String password,
  }) async {
    try {
      final credential = await _firebaseAuth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      _startTokenRefreshTimer();
      return credential;
    } on FirebaseAuthException catch (e) {
      throw _handleAuthError(e);
    }
  }

  /// Sign up with email and password
  Future<UserCredential> signUpWithEmailPassword({
    required String email,
    required String password,
  }) async {
    try {
      final credential = await _firebaseAuth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      _startTokenRefreshTimer();
      return credential;
    } on FirebaseAuthException catch (e) {
      throw _handleAuthError(e);
    }
  }

  /// Sign out
  Future<void> logout() async {
    try {
      await _firebaseAuth.signOut();
      _clearTokenCache();
      _stopTokenRefreshTimer();
    } catch (e) {
      print('❌ Error logging out: $e');
      rethrow;
    }
  }

  /// Send password reset email
  Future<void> sendPasswordResetEmail(String email) async {
    try {
      await _firebaseAuth.sendPasswordResetEmail(email: email);
    } on FirebaseAuthException catch (e) {
      throw _handleAuthError(e);
    }
  }

  /// Update user password
  Future<void> updatePassword(String newPassword) async {
    try {
      await currentUser?.updatePassword(newPassword);
    } on FirebaseAuthException catch (e) {
      throw _handleAuthError(e);
    }
  }

  /// Update user email
  Future<void> updateEmail(String newEmail) async {
    try {
      await currentUser?.verifyBeforeUpdateEmail(newEmail);
    } on FirebaseAuthException catch (e) {
      throw _handleAuthError(e);
    }
  }

  /// Reload user data
  Future<void> reloadUser() async {
    await currentUser?.reload();
  }

  // ========== Helper Methods ==========

  /// Clear token cache
  void _clearTokenCache() {
    _cachedToken = null;
    _tokenExpiryTime = null;
  }

  /// Handle Firebase Auth errors
  AuthException _handleAuthError(FirebaseAuthException e) {
    String message;
    
    switch (e.code) {
      case 'user-not-found':
        message = 'No user found with this email';
        break;
      case 'wrong-password':
        message = 'Incorrect password';
        break;
      case 'email-already-in-use':
        message = 'An account already exists with this email';
        break;
      case 'invalid-email':
        message = 'Invalid email address';
        break;
      case 'weak-password':
        message = 'Password is too weak';
        break;
      case 'user-disabled':
        message = 'This account has been disabled';
        break;
      case 'too-many-requests':
        message = 'Too many attempts. Please try again later';
        break;
      case 'operation-not-allowed':
        message = 'Operation not allowed';
        break;
      case 'requires-recent-login':
        message = 'Please login again to continue';
        break;
      default:
        message = e.message ?? 'An authentication error occurred';
    }

    return AuthException(message: message, code: e.code);
  }

  /// Dispose resources
  void dispose() {
    _stopTokenRefreshTimer();
  }
}

// ========== Exception Class ==========

/// Custom Auth Exception
class AuthException implements Exception {
  final String message;
  final String code;

  AuthException({required this.message, required this.code});

  @override
  String toString() => message;
}
