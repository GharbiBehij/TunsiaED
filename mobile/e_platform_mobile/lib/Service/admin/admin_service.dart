import 'package:dio/dio.dart';

import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Admin Service
/// Handles all admin-related API calls
class AdminService {
  final ApiClient _apiClient = ApiClient();

  /// Get admin dashboard
  Future<Map<String, dynamic>> getAdminDashboard() async {
    Map<String, dynamic> _mapOrEmpty(dynamic source) {
      if (source is Map<String, dynamic>) {
        return source;
      }
      if (source is Map) {
        return source.map((key, value) => MapEntry(key.toString(), value));
      }
      return <String, dynamic>{};
    }

    List<dynamic> _listOrEmpty(dynamic source) {
      if (source is List) {
        return source;
      }
      return const <dynamic>[];
    }

    final responses = await Future.wait<Response<dynamic>>(
      [
        _apiClient.get(ApiEndpoints.adminStats),
        _apiClient.get(ApiEndpoints.adminRevenue),
        _apiClient.get(ApiEndpoints.adminActivity),
        _apiClient.get(ApiEndpoints.adminCoursePerformance),
        _apiClient.get(ApiEndpoints.adminUserEngagement),
        _apiClient.get(ApiEndpoints.adminActivePromotions),
        _apiClient.get(ApiEndpoints.adminSubscriptionPlans),
        _apiClient.get(ApiEndpoints.adminSubscriptionStats),
      ],
      eagerError: true,
    );

    return {
      'stats': _mapOrEmpty(responses[0].data),
      'revenueChart': _mapOrEmpty(responses[1].data),
      'recentActivity': _listOrEmpty(responses[2].data),
      'coursePerformance': _listOrEmpty(responses[3].data),
      'userEngagement': _mapOrEmpty(responses[4].data),
      'activePromotions': _listOrEmpty(responses[5].data),
      'subscriptionPlans': _listOrEmpty(responses[6].data),
      'subscriptionStats': _mapOrEmpty(responses[7].data),
    };
  }

  /// Get admin stats
  Future<Map<String, dynamic>> getAdminStats() async {
    final response = await _apiClient.get(
      ApiEndpoints.adminStats,
    );
    return response.data;
  }

  /// Get all users (admin view)
  Future<List<Map<String, dynamic>>> getAllUsers({
    int? page,
    int? limit,
    String? role,
  }) async {
    final response = await _apiClient.get(
      ApiEndpoints.adminUsers,
      queryParameters: {
        if (page != null) 'page': page,
        if (limit != null) 'limit': limit,
        if (role != null) 'role': role,
      },
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get all courses (admin view)
  Future<List<Map<String, dynamic>>> getAllCourses({
    int? page,
    int? limit,
    String? status,
  }) async {
    final response = await _apiClient.get(
      ApiEndpoints.adminCourses,
      queryParameters: {
        if (page != null) 'page': page,
        if (limit != null) 'limit': limit,
        if (status != null) 'status': status,
      },
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Approve course
  Future<Map<String, dynamic>> approveCourse(String courseId) async {
    final response = await _apiClient.patch(
      '${ApiEndpoints.adminCourses}/$courseId/approve',
    );
    return response.data;
  }

  /// Reject course
  Future<Map<String, dynamic>> rejectCourse(
    String courseId,
    String reason,
  ) async {
    final response = await _apiClient.patch(
      '${ApiEndpoints.adminCourses}/$courseId/reject',
      data: {'reason': reason},
    );
    return response.data;
  }

  /// Ban user
  Future<Map<String, dynamic>> banUser(String userId) async {
    final response = await _apiClient.patch(
      '${ApiEndpoints.adminUsers}/$userId/ban',
    );
    return response.data;
  }

  /// Unban user
  Future<Map<String, dynamic>> unbanUser(String userId) async {
    final response = await _apiClient.patch(
      '${ApiEndpoints.adminUsers}/$userId/unban',
    );
    return response.data;
  }

  /// Get revenue analytics (standardized method name)
  Future<Map<String, dynamic>> getRevenueData() async {
    final response = await _apiClient.get(
      ApiEndpoints.adminRevenue,
    );
    return response.data;
  }

  /// Get recent platform activity
  Future<List<Map<String, dynamic>>> getRecentActivity({int limit = 10}) async {
    final response = await _apiClient.get(
      ApiEndpoints.adminActivity,
      queryParameters: {
        'limit': limit,
      },
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Legacy alias for backward compatibility
  @Deprecated('Use getRevenueData() instead')
  Future<Map<String, dynamic>> getRevenue() => getRevenueData();

  /// Get course performance metrics
  Future<List<Map<String, dynamic>>> getCoursePerformance() async {
    final response = await _apiClient.get(
      ApiEndpoints.adminCoursePerformance,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get user engagement metrics
  Future<Map<String, dynamic>> getUserEngagement() async {
    final response = await _apiClient.get(
      ApiEndpoints.adminUserEngagement,
    );
    return response.data;
  }

  /// Get active promotions
  Future<List<Map<String, dynamic>>> getActivePromotions() async {
    final response = await _apiClient.get(
      ApiEndpoints.adminActivePromotions,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Create a new promotion
  Future<Map<String, dynamic>> createPromotion(
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.adminPromotions,
      data: data,
    );
    return response.data;
  }

  /// Get subscription plans
  Future<List<Map<String, dynamic>>> getSubscriptionPlans() async {
    final response = await _apiClient.get(
      ApiEndpoints.adminSubscriptionPlans,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get subscription statistics
  Future<Map<String, dynamic>> getSubscriptionStats() async {
    final response = await _apiClient.get(
      ApiEndpoints.adminSubscriptionStats,
    );
    return response.data;
  }

  /// Update subscription plan
  Future<Map<String, dynamic>> updateSubscriptionPlan(
    String planId,
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.patch(
      ApiEndpoints.adminSubscriptionPlan(planId),
      data: data,
    );
    return response.data;
  }
}
