import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// Transaction Service
/// Handles all transaction-related API calls
class TransactionService {
  final ApiClient _apiClient = ApiClient();

  /// Get all transactions for current user
  Future<List<Map<String, dynamic>>> getTransactions({
    int? page,
    int? limit,
  }) async {
    final response = await _apiClient.get(
      ApiEndpoints.transactions,
      queryParameters: {
        if (page != null) 'page': page,
        if (limit != null) 'limit': limit,
      },
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get transaction by ID
  Future<Map<String, dynamic>> getTransactionById(
    String transactionId,
  ) async {
    final response = await _apiClient.get(
      ApiEndpoints.transactionById(transactionId),
    );
    return response.data;
  }

  /// Get transactions by status
  Future<List<Map<String, dynamic>>> getTransactionsByStatus(
    String status,
  ) async {
    final response = await _apiClient.get(
      ApiEndpoints.transactions,
      queryParameters: {'status': status},
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get transaction history
  Future<List<Map<String, dynamic>>> getTransactionHistory({
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.transactions}/history',
      queryParameters: {
        if (startDate != null) 'startDate': startDate.toIso8601String(),
        if (endDate != null) 'endDate': endDate.toIso8601String(),
      },
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Create transaction
  Future<Map<String, dynamic>> createTransaction(
    Map<String, dynamic> transactionData,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.transactions,
      data: transactionData,
    );
    return response.data;
  }

  /// Get transactions by payment
  Future<List<Map<String, dynamic>>> getTransactionsByPayment(
    String paymentId,
  ) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.transactions}/payment/$paymentId',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Get course transactions
  Future<List<Map<String, dynamic>>> getCourseTransactions(
    String courseId,
  ) async {
    final response = await _apiClient.get(
      '${ApiEndpoints.transactions}/course/$courseId',
    );
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Update transaction
  Future<Map<String, dynamic>> updateTransaction(
    String transactionId,
    Map<String, dynamic> transactionData,
  ) async {
    final response = await _apiClient.put(
      ApiEndpoints.transactionById(transactionId),
      data: transactionData,
    );
    return response.data;
  }
}
