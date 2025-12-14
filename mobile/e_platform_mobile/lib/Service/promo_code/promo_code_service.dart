import '../../core/api/api_client.dart';
import '../../core/api/api_endpoints.dart';

/// PromoCode Service
/// Handles all promo code-related API calls
class PromoCodeService {
  final ApiClient _apiClient = ApiClient();

  // ========== PUBLIC METHODS (No auth required) ==========

  /// Validate promo code (PUBLIC)
  /// Returns discount information if valid
  Future<Map<String, dynamic>> validatePromoCode({
    required String code,
    required double subtotal,
    String? courseId,
  }) async {
    final response = await _apiClient.post(
      ApiEndpoints.promoCodeValidate,
      data: {
        'code': code,
        'subtotal': subtotal,
        if (courseId != null) 'courseId': courseId,
      },
    );
    return response.data;
  }

  // ========== ADMIN METHODS (Auth required, admin only) ==========

  /// Create promo code (ADMIN ONLY)
  Future<Map<String, dynamic>> createPromoCode(
    Map<String, dynamic> promoCodeData,
  ) async {
    final response = await _apiClient.post(
      ApiEndpoints.promoCodes,
      data: promoCodeData,
    );
    return response.data;
  }

  /// Get all active promo codes (ADMIN ONLY)
  Future<List<Map<String, dynamic>>> getAllPromoCodes() async {
    final response = await _apiClient.get(
      ApiEndpoints.promoCodes,
    );
    
    // Handle response format { promoCodes: [...] }
    if (response.data is Map && response.data['promoCodes'] != null) {
      return List<Map<String, dynamic>>.from(response.data['promoCodes']);
    }
    
    return List<Map<String, dynamic>>.from(response.data);
  }

  /// Update promo code (ADMIN ONLY)
  Future<Map<String, dynamic>> updatePromoCode(
    String promoCodeId,
    Map<String, dynamic> updateData,
  ) async {
    final response = await _apiClient.patch(
      ApiEndpoints.promoCodeById(promoCodeId),
      data: updateData,
    );
    return response.data;
  }

  /// Delete promo code (ADMIN ONLY)
  Future<void> deletePromoCode(String promoCodeId) async {
    await _apiClient.delete(
      ApiEndpoints.promoCodeById(promoCodeId),
    );
  }
}
