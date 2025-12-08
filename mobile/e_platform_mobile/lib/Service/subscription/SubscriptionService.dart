import 'package:dio/dio.dart';

import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Subscription Service
/// Handles subscription-related API calls for users
class SubscriptionService {
  final ApiClient _apiClient = ApiClient();

  /// Get all available subscription plans
  Future<List<Map<String, dynamic>>> getSubscriptionPlans() async {
    final response = await _apiClient.get(
      ApiEndpoints.paymentSubscriptionPlans,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get a specific subscription plan by ID
  Future<Map<String, dynamic>> getSubscriptionPlanById(String planId) async {
    final response = await _apiClient.get(
      ApiEndpoints.paymentSubscriptionPlanById(planId),
    );
    return response.data;
  }

  /// Initiate subscription purchase
  Future<Map<String, dynamic>> initiateSubscription(String planId) async {
    final response = await _apiClient.post(
      ApiEndpoints.purchaseInitiate,
      data: {
        'planId': planId,
        'paymentType': 'subscription',
        'paymentMethod': 'stripe',
      },
    );
    return response.data;
  }
}