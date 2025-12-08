import 'package:flutter/foundation.dart';
import '../../Service/promo_code/promo_code_service.dart';
import '../../core/api/api_exception.dart';

/// PromoCode ViewModel
/// Manages promo code state and operations
class PromoCodeViewModel extends ChangeNotifier {
  final PromoCodeService _promoCodeService = PromoCodeService();

  bool _isLoading = false;
  String? _error;
  Map<String, dynamic>? _validatedPromo;
  List<Map<String, dynamic>> _promoCodes = [];

  bool get isLoading => _isLoading;
  String? get error => _error;
  Map<String, dynamic>? get validatedPromo => _validatedPromo;
  List<Map<String, dynamic>> get promoCodes => _promoCodes;

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
  }

  // ========== Public Methods ==========

  /// Validate promo code
  /// Returns true if valid, false otherwise
  Future<bool> validatePromoCode({
    required String code,
    required double subtotal,
    String? courseId,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final result = await _promoCodeService.validatePromoCode(
        code: code,
        subtotal: subtotal,
        courseId: courseId,
      );

      if (result['valid'] == true) {
        _validatedPromo = result;
        notifyListeners();
        return true;
      } else {
        _setError(result['error'] ?? 'Invalid promo code');
        _validatedPromo = null;
        return false;
      }
    } on ApiException catch (e) {
      _setError(e.message);
      _validatedPromo = null;
      return false;
    } catch (e) {
      _setError('Failed to validate promo code: ${e.toString()}');
      _validatedPromo = null;
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Clear validated promo code
  void clearValidatedPromo() {
    _validatedPromo = null;
    _clearError();
    notifyListeners();
  }

  /// Get discount amount from validated promo
  double getDiscountAmount() {
    if (_validatedPromo == null) return 0.0;
    return (_validatedPromo!['discount'] ?? 0.0).toDouble();
  }

  /// Check if promo is currently applied
  bool get isPromoApplied => _validatedPromo != null;

  // ========== Admin Methods ==========

  /// Fetch all promo codes (admin only)
  Future<void> fetchAllPromoCodes() async {
    _setLoading(true);
    _clearError();

    try {
      _promoCodes = await _promoCodeService.getAllPromoCodes();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to fetch promo codes: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  /// Create promo code (admin only)
  Future<bool> createPromoCode(Map<String, dynamic> promoCodeData) async {
    _setLoading(true);
    _clearError();

    try {
      await _promoCodeService.createPromoCode(promoCodeData);
      // Refresh list after creation
      await fetchAllPromoCodes();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } catch (e) {
      _setError('Failed to create promo code: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Update promo code (admin only)
  Future<bool> updatePromoCode(
    String promoCodeId,
    Map<String, dynamic> updateData,
  ) async {
    _setLoading(true);
    _clearError();

    try {
      await _promoCodeService.updatePromoCode(promoCodeId, updateData);
      // Refresh list after update
      await fetchAllPromoCodes();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } catch (e) {
      _setError('Failed to update promo code: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Delete promo code (admin only)
  Future<bool> deletePromoCode(String promoCodeId) async {
    _setLoading(true);
    _clearError();

    try {
      await _promoCodeService.deletePromoCode(promoCodeId);
      // Refresh list after deletion
      await fetchAllPromoCodes();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } catch (e) {
      _setError('Failed to delete promo code: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Clear all state
  void clear() {
    _promoCodes = [];
    _validatedPromo = null;
    _error = null;
    _isLoading = false;
    notifyListeners();
  }
}
