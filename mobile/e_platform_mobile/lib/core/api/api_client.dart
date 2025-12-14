import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../config/app_config.dart';
import '../auth/auth_service.dart';

/// API Client for making HTTP requests to the backend
/// Handles authentication, error handling, and request/response interceptors
class ApiClient {
  late final Dio _dio;
  final AuthService _authService = AuthService();

  ApiClient() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBaseUrl,
        connectTimeout: AppConfig.apiTimeout,
        receiveTimeout: AppConfig.apiTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _setupInterceptors();
  }

  /// Setup request and response interceptors
  void _setupInterceptors() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Inject auth token to every request
          final token = await _authService.getIdToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) async {
          // Handle 401 errors by refreshing token
          if (error.response?.statusCode == 401) {
            try {
              // Attempt to refresh token
              final newToken = await _authService.refreshToken();
              if (newToken != null) {
                // Retry the request with new token
                error.requestOptions.headers['Authorization'] =
                    'Bearer $newToken';
                final response = await _dio.fetch(error.requestOptions);
                return handler.resolve(response);
              }
            } catch (e) {
              // If refresh fails, logout user
              await _authService.logout();
              return handler.reject(error);
            }
          }
          return handler.next(error);
        },
        onResponse: (response, handler) {
          // Log successful responses in debug mode
          if (AppConfig.isDebugMode) {
            print('✅ Response [${response.statusCode}] => ${response.requestOptions.path}');
          }
          return handler.next(response);
        },
      ),
    );
  }

  // ========== HTTP Methods ==========

  /// GET request
  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options,
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  /// POST request
  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.post<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  /// PUT request
  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.put<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  /// PATCH request
  Future<Response<T>> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.patch<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  /// DELETE request
  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.delete<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  // ========== Error Handling ==========

  /// Handle and transform errors into user-friendly messages
  ApiException _handleError(dynamic error) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return ApiException(
            message: 'Connection timeout. Please check your internet connection.',
            statusCode: null,
            type: ApiExceptionType.timeout,
          );

        case DioExceptionType.badResponse:
          final statusCode = error.response?.statusCode;
          final message = error.response?.data?['message'] ?? 
                          error.response?.data?['error'] ?? 
                          'Something went wrong';
          
          return ApiException(
            message: message,
            statusCode: statusCode,
            type: _getExceptionType(statusCode),
          );

        case DioExceptionType.cancel:
          return ApiException(
            message: 'Request was cancelled',
            statusCode: null,
            type: ApiExceptionType.cancel,
          );

        case DioExceptionType.unknown:
          return ApiException(
            message: 'No internet connection. Please check your network.',
            statusCode: null,
            type: ApiExceptionType.network,
          );

        default:
          return ApiException(
            message: 'An unexpected error occurred',
            statusCode: null,
            type: ApiExceptionType.unknown,
          );
      }
    }

    return ApiException(
      message: error.toString(),
      statusCode: null,
      type: ApiExceptionType.unknown,
    );
  }

  /// Determine exception type from status code
  ApiExceptionType _getExceptionType(int? statusCode) {
    if (statusCode == null) return ApiExceptionType.unknown;
    
    if (statusCode >= 500) return ApiExceptionType.server;
    if (statusCode == 401) return ApiExceptionType.unauthorized;
    if (statusCode == 403) return ApiExceptionType.forbidden;
    if (statusCode == 404) return ApiExceptionType.notFound;
    if (statusCode >= 400) return ApiExceptionType.badRequest;
    
    return ApiExceptionType.unknown;
  }
}

// ========== Exception Classes ==========

/// Custom API Exception
class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final ApiExceptionType type;

  ApiException({
    required this.message,
    required this.statusCode,
    required this.type,
  });

  @override
  String toString() => message;
}

/// API Exception Types
enum ApiExceptionType {
  timeout,
  network,
  server,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
  cancel,
  unknown,
}
