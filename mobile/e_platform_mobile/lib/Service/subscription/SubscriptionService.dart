import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Subscription Service
/// Handles subscription-related API calls for users
/// Follows exact web architecture
class SubscriptionService {
  final ApiClient _apiClient = ApiClient();

  /// Fetches all available subscription plans
  /// @returns List of subscription plans
  Future<List<Map<String, dynamic>>> getSubscriptionPlans() async {
    final response = await _apiClient.get(
      ApiEndpoints.paymentSubscriptionPlans,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Fetches a specific subscription plan by ID
  /// @param planId - The ID of the plan
  /// @returns Subscription plan data
  Future<Map<String, dynamic>> getSubscriptionPlanById(String planId) async {
    final response = await _apiClient.get(
      ApiEndpoints.paymentSubscriptionPlanById(planId),
    );
    return response.data;
  }

  /// Initiates subscription purchase
  /// @param planId - The subscription plan ID
  /// @param subscriptionType - 'monthly' | 'yearly' (optional, defaults to plan type)
  /// @returns Payment data with paymentId
  Future<Map<String, dynamic>> initiateSubscription(
    String planId, {
    String? subscriptionType,
  }) async {
    final response = await _apiClient.post(
      ApiEndpoints.purchaseInitiate,
      data: {
        'planId': planId,
        'paymentType': 'subscription',
        'paymentMethod': 'paymee',
        if (subscriptionType != null) 'subscriptionType': subscriptionType,
      },
    );
    return response.data;
  }
}