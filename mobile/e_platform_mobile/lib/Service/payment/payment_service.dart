import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Payment Service
/// Handles all payment-related API calls
class PaymentService {
  final ApiClient _apiClient = ApiClient();

  // ========== ORCHESTRATOR METHODS (Purchase Flow) ==========

  /// Initiate purchase (ORCHESTRATOR)
  /// Cross-module: Payment + Enrollment + Course modules
  /// Creates payment with validation (checks enrollment status, course exists)
  Future<Map<String, dynamic>> initiatePurchase(
    Map<String, dynamic> purchaseData,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.purchaseInitiate,
      data: purchaseData,
    );
    return response.data;
  }

  /// Complete purchase (ORCHESTRATOR)
  /// Cross-module: Payment + Transaction + Enrollment modules
  /// Creates transaction and enrollment atomically
  Future<Map<String, dynamic>> completePurchase(
    Map<String, dynamic> confirmationData,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.purchaseComplete,
      data: confirmationData,
    );
    return response.data;
  }

  /// Get purchase status (ORCHESTRATOR)
  /// Cross-module: Payment + Transaction + Enrollment modules
  /// Returns complete purchase status (payment + transaction + enrollment)
  Future<Map<String, dynamic>> getPurchaseStatus(String paymentId) async {
    final response = await _apiClient.get(
      ApiEndpoints.purchaseStatus(paymentId),
    );
    return response.data;
  }

  // ========== STRIPE GATEWAY METHODS ==========

  /// Initiate Stripe payment (GATEWAY)
  /// Creates payment and returns Stripe Checkout URL
  Future<Map<String, dynamic>> initiateStripePayment(
    Map<String, dynamic> paymentData,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.stripeInitiate,
      data: paymentData,
    );
    return response.data; // { paymentId, sessionId, checkoutUrl, amount }
  }

  /// Get Stripe payment status by session ID (GATEWAY)
  /// Used after Stripe Checkout completion
  Future<Map<String, dynamic>> getStripePaymentStatus(String sessionId) async {
    final response = await _apiClient.get(
      ApiEndpoints.stripeStatus(sessionId),
    );
    return response.data;
  }

  // ========== DIRECT PAYMENT METHODS ==========

  /// Get payment by ID (DIRECT)
  Future<Map<String, dynamic>> getPaymentById(String paymentId) async {
    final response = await _apiClient.get(
      ApiEndpoints.paymentById(paymentId),
    );
    return response.data;
  }

  /// Get all payments for current user (DIRECT)
  Future<List<Map<String, dynamic>>> getMyPayments() async {
    final response = await _apiClient.get(
      ApiEndpoints.myPayments,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get payments for specific course (DIRECT)
  Future<List<Map<String, dynamic>>> getCoursePayments(String courseId) async {
    final response = await _apiClient.get(
      ApiEndpoints.coursePayments(courseId),
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get payments by status (DIRECT)
  Future<List<Map<String, dynamic>>> getPaymentsByStatus(String status) async {
    final response = await _apiClient.get(
      ApiEndpoints.paymentsByStatus(status),
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get payment status (DIRECT - legacy)
  Future<Map<String, dynamic>> getPaymentStatus(String paymentId) async {
    final response = await _apiClient.get(
      ApiEndpoints.paymentById(paymentId),
    );
    return response.data;
  }

  /// Get all payments for current user (DIRECT - legacy)
  @Deprecated('Use getMyPayments() instead')
  Future<List<Map<String, dynamic>>> getPayments() async {
    return getMyPayments();
  }

  /// Cancel payment
  Future<Map<String, dynamic>> cancelPayment(String paymentId) async {
    final response = await _apiClient.patch(
      '${ApiEndpoints.payments}/$paymentId/cancel',
    );
    return response.data;
  }

  /// Refund payment (admin only)
  Future<Map<String, dynamic>> refundPayment(String paymentId) async {
    final response = await _apiClient.post(
      '${ApiEndpoints.payments}/$paymentId/refund',
    );
    return response.data;
  }

  // ========== TESTING METHODS ==========

  /// Simulate payment (TESTING)
  /// For testing when payment gateway is unavailable
  /// Creates payment, completes it, and sends email notification
  Future<Map<String, dynamic>> simulatePayment(
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.simulatePayment,
      data: data,
    );
    return response.data; // { success, message, paymentId, transactionId?, enrollment? }
  }
}
