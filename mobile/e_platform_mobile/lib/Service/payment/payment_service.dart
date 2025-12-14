import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Payment Service
/// Handles all payment-related API calls
/// Follows exact web architecture with field normalization
class PaymentService {
  final ApiClient _apiClient = ApiClient();

  // ====================================================================
  // ORCHESTRATED PURCHASE FLOW (recommended for course purchases)
  // These endpoints use the CoursePurchaseOrchestrator for atomic operations
  // ====================================================================

  /// Initiate a course purchase (creates payment, validates course & enrollment)
  /// @param purchaseData - { courseId, paymentType?, subscriptionType?, paymentMethod? }
  /// @returns Payment initiation data { paymentId, amount, currency, courseId, courseTitle, status }
  Future<Map<String, dynamic>> initiatePurchase(
    Map<String, dynamic> purchaseData,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.purchaseInitiate,
      data: purchaseData,
    );
    
    // Normalize: ensure paymentId field exists (web compatibility)
    final raw = response.data;
    final normalized = {
      ...raw,
      'paymentId': raw['paymentId'] ?? raw['id'] ?? raw['_id'],
    };
    
    print('💳 [PaymentService] initiatePurchase response normalized: $normalized');
    return normalized;
  }

  /// Complete a course purchase (creates transaction + enrollment after payment confirmation)
  /// @param confirmationData - { paymentId, gatewayTransactionId?, paymentGateway? }
  /// @returns Completion data { success, transaction, enrollment }
  Future<Map<String, dynamic>> completePurchase(
    Map<String, dynamic> confirmationData,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.purchaseComplete,
      data: confirmationData,
    );
    
    final raw = response.data;
    // Normalize any payment references (web compatibility)
    if (raw['payment'] != null) {
      final payment = raw['payment'] as Map<String, dynamic>;
      raw['payment'] = {
        ...payment,
        'paymentId': payment['paymentId'] ?? payment['id'] ?? payment['_id'],
      };
    }
    return raw;
  }

  /// Get purchase status (payment + transaction + enrollment status)
  /// @param paymentId - The payment ID
  /// @returns Status data { payment, transaction, enrollment }
  Future<Map<String, dynamic>> getPurchaseStatus(String paymentId) async {
    final response = await _apiClient.get(
      ApiEndpoints.purchaseStatus(paymentId),
    );
    return response.data;
  }

  // ====================================================================
  // STRIPE GATEWAY OPERATIONS (International payment gateway)
  // Integration using Stripe Checkout
  // ====================================================================

  /// Initiate a Stripe payment
  /// Returns Stripe Checkout URL for payment
  /// @param paymentData - { paymentId, courseId, amount, note, firstName, lastName, email, phone }
  /// @returns { paymentId, sessionId, checkoutUrl, amount, currency }
  Future<Map<String, dynamic>> initiateStripePayment(
    Map<String, dynamic> paymentData,
  ) async {
    try {
      final response = await _apiClient.post(
        ApiEndpoints.stripeInitiate,
        data: paymentData,
      );
      
      final responseData = response.data;
      
      // Normalize: ensure paymentId field exists (web compatibility)
      final normalized = {
        ...responseData,
        'paymentId': responseData['paymentId'] ?? responseData['id'] ?? responseData['_id'],
      };
      
      print('💳 [PaymentService] initiateStripePayment response normalized: $normalized');
      return normalized;
    } catch (error) {
      // Check for payment gateway downtime (503 Service Unavailable)
      if (error.toString().contains('503')) {
        throw Exception('Payment gateway temporarily unavailable. Please try test mode or try again later.');
      }
      rethrow;
    }
  }

  /// Get Stripe payment status by session ID
  /// Used after Stripe Checkout completion
  /// @param sessionId - The Stripe session ID
  /// @returns { paymentId, status, courseId, amount }
  Future<Map<String, dynamic>> getStripePaymentStatus(String sessionId) async {
    final response = await _apiClient.get(
      ApiEndpoints.stripeStatus(sessionId),
    );
    
    final raw = response.data;
    // Normalize: ensure paymentId field exists (web compatibility)
    return {
      ...raw,
      'paymentId': raw['paymentId'] ?? raw['id'] ?? raw['_id'],
    };
  }

  // ====================================================================
  // DIRECT PAYMENT MODULE OPERATIONS (for admin/advanced use cases)
  // These bypass the orchestrator and work directly with the payment module
  // ====================================================================

  /// Creates a new payment (direct payment module call)
  /// @param paymentData - Payment data
  /// @returns Created payment data
  Future<Map<String, dynamic>> createPayment(Map<String, dynamic> paymentData) async {
    final response = await _apiClient.post(
      ApiEndpoints.payments,
      data: paymentData,
    );
    return response.data;
  }

  /// Fetches payments for the authenticated user
  /// @returns List of user's payments
  Future<List<Map<String, dynamic>>> getUserPayments() async {
    final response = await _apiClient.get(
      ApiEndpoints.myPayments,
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Fetches a specific payment by ID
  /// @param paymentId - The ID of the payment
  /// @returns Payment data
  Future<Map<String, dynamic>> getPaymentById(String paymentId) async {
    final response = await _apiClient.get(
      ApiEndpoints.paymentById(paymentId),
    );
    return response.data;
  }

  /// Fetches payments for a specific course
  /// @param courseId - The ID of the course
  /// @returns List of payments for the course (requires admin or instructor role)
  Future<List<Map<String, dynamic>>> getCoursePayments(String courseId) async {
    final response = await _apiClient.get(
      ApiEndpoints.coursePayments(courseId),
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Fetches payments by status
  /// @param status - Payment status (e.g., 'pending', 'completed')
  /// @returns List of payments with the specified status (requires admin role)
  Future<List<Map<String, dynamic>>> getPaymentsByStatus(String status) async {
    final response = await _apiClient.get(
      ApiEndpoints.paymentsByStatus(status),
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Updates an existing payment
  /// @param paymentId - The ID of the payment to update
  /// @param paymentData - Updated payment data
  /// @returns Updated payment data
  Future<Map<String, dynamic>> updatePayment(
    String paymentId, 
    Map<String, dynamic> paymentData,
  ) async {
    final response = await _apiClient.put(
      ApiEndpoints.paymentById(paymentId),
      data: paymentData,
    );
    return response.data;
  }

  // ====================================================================
  // PAYMENT SIMULATION (for testing when payment gateway is unavailable)
  // ====================================================================

  /// Simulate a payment (for testing purposes)
  /// Creates payment, completes it, and sends email notification
  /// @param data - { courseId, simulateSuccess: true/false }
  /// @returns { success, message, paymentId, transactionId?, enrollment? }
  Future<Map<String, dynamic>> simulatePayment(
    Map<String, dynamic> data,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.simulatePayment,
      data: data,
    );
    
    final raw = response.data;
    // Normalize: ensure paymentId field exists (web compatibility)
    if (raw['payment'] != null) {
      final payment = raw['payment'] as Map<String, dynamic>;
      raw['payment'] = {
        ...payment,
        'paymentId': payment['paymentId'] ?? payment['id'] ?? payment['_id'],
      };
    }
    return {
      ...raw,
      'paymentId': raw['paymentId'] ?? raw['id'] ?? raw['_id'],
    };
  }
}
