// lib/Service/AuthService.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class LoginCredentials {
  final String email;
  final String password;

  LoginCredentials({required this.email, required this.password});

  Map<String, dynamic> toJson() => {
        'email': email,
        'password': password,
      };
}

class AuthResponse {
  final User user;
  final String token;

  AuthResponse({required this.user, required this.token});

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      user: User.fromJson(json['user']),
      token: json['token'],
    );
  }
}

class User {
  final String userId;
  final String email;
  final String name;
  final String? photoURL;
  final String role;
  final String createdAt;

  User({
    required this.userId,
    required this.email,
    required this.name,
    this.photoURL,
    required this.role,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userId: json['userId'],
      email: json['email'],
      name: json['name'],
      photoURL: json['photoURL'],
      role: json['role'],
      createdAt: json['createdAt'],
    );
  }
}

class ServiceResponse<T> {
  final String status;
  final T? data;
  final String? message;
  final bool retryable;

  ServiceResponse({
    required this.status,
    this.data,
    this.message,
    this.retryable = false,
  });
}

class AuthService {
  static const String _baseUrl = String.fromEnvironment(
    'BFF_URL',
    defaultValue: 'http://localhost:3001',
  );

  Future<ServiceResponse<AuthResponse>> login(LoginCredentials credentials) async {
    try {
      if (credentials.email.isEmpty || credentials.password.isEmpty) {
        return ServiceResponse<AuthResponse>(
          status: 'error',
          message: 'Invalid inputs',
          retryable: true,
        );
      }

      final response = await http.post(
        Uri.parse('$_baseUrl/api/v1/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(credentials.toJson()),
      );

      if (response.statusCode == 200) {
        final data = AuthResponse.fromJson(jsonDecode(response.body));
        return ServiceResponse<AuthResponse>(
          status: 'success',
          data: data,
        );
      } else {
        final error = jsonDecode(response.body);
        return ServiceResponse<AuthResponse>(
          status: 'error',
          message: error['error'] ?? 'Login failed',
          retryable: true,
        );
      }
    } catch (exception) {
      print('AuthService.login Failed: $exception');
      return ServiceResponse<AuthResponse>(
        status: 'error',
        message: 'Connection failed',
        retryable: true,
      );
    }
  }

  Future<ServiceResponse<AuthResponse>> signup({
    required String email,
    required String password,
    required String name,
    String? role,
  }) async {
    try {
      if (email.isEmpty || password.isEmpty || name.isEmpty) {
        return ServiceResponse<AuthResponse>(
          status: 'error',
          message: 'Invalid inputs',
          retryable: true,
        );
      }

      final response = await http.post(
        Uri.parse('$_baseUrl/api/v1/auth/signup'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
          'name': name,
          'role': role ?? 'Student',
        }),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = AuthResponse.fromJson(jsonDecode(response.body));
        return ServiceResponse<AuthResponse>(
          status: 'success',
          data: data,
        );
      } else {
        final error = jsonDecode(response.body);
        return ServiceResponse<AuthResponse>(
          status: 'error',
          message: error['error'] ?? 'Signup failed',
          retryable: true,
        );
      }
    } catch (exception) {
      print('AuthService.signup Failed: $exception');
      return ServiceResponse<AuthResponse>(
        status: 'error',
        message: 'Connection failed',
        retryable: true,
      );
    }
  }
}
