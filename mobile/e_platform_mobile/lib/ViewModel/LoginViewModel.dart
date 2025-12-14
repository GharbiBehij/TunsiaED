// lib/ViewModel/LoginViewModel.dart
import 'package:flutter/foundation.dart';
import '../Service/AuthService.dart';

enum LoginStatus { idle, loading, success, error }

class LoginState {
  final LoginStatus status;
  final String? message;
  final AuthResponse? data;

  LoginState({
    this.status = LoginStatus.idle,
    this.message,
    this.data,
  });

  LoginState copyWith({
    LoginStatus? status,
    String? message,
    AuthResponse? data,
  }) {
    return LoginState(
      status: status ?? this.status,
      message: message ?? this.message,
      data: data ?? this.data,
    );
  }
}

class LoginViewModel extends ChangeNotifier {
  final AuthService _authService = AuthService();
  LoginState _state = LoginState();

  LoginState get state => _state;

  Future<void> login(String email, String password) async {
    _setState(_state.copyWith(status: LoginStatus.loading));
    notifyListeners();

    try {
      final response = await _authService.login(
        LoginCredentials(email: email, password: password),
      );

      // Retry once if it's a transient error
      if (response.status == 'error' && response.retryable == true) {
        final retryResponse = await _authService.login(
          LoginCredentials(email: email, password: password),
        );

        if (retryResponse.status == 'success' && retryResponse.data != null) {
          _setState(_state.copyWith(
            status: LoginStatus.success,
            data: retryResponse.data,
          ));
        } else {
          _setState(_state.copyWith(
            status: LoginStatus.error,
            message: retryResponse.message ?? 'Login failed',
          ));
        }
      } else if (response.status == 'success' && response.data != null) {
        _setState(_state.copyWith(
          status: LoginStatus.success,
          data: response.data,
        ));
      } else {
        _setState(_state.copyWith(
          status: LoginStatus.error,
          message: response.message ?? 'Login failed',
        ));
      }
    } catch (exception) {
      print('LoginViewModel.login failed: $exception');
      _setState(_state.copyWith(
        status: LoginStatus.error,
        message: 'Unexpected failure occurred',
      ));
    } finally {
      notifyListeners();
    }
  }

  void _setState(LoginState newState) {
    _state = newState;
  }

  void reset() {
    _state = LoginState();
    notifyListeners();
  }
}

