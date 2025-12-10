import 'package:flutter/foundation.dart';
import '../../Service/subscription/SubscriptionService.dart';
import '../../core/api/api_client.dart';

/// Subscription ViewModel
/// Manages subscription plans and subscription purchases
class SubscriptionViewModel extends ChangeNotifier {
  final SubscriptionService _subscriptionService = SubscriptionService();

  List<Map<String, dynamic>> _plans = [];
  Map<String, dynamic>? _selectedPlan;
  Map<String, dynamic>? _initiatedSubscription;

  bool _isLoading = false;
  String? _error;

  // Getters
  List<Map<String, dynamic>> get plans => _plans;
  Map<String, dynamic>? get selectedPlan => _selectedPlan;
  Map<String, dynamic>? get initiatedSubscription => _initiatedSubscription;
  bool get isLoading => _isLoading;
  String? get error => _error;

  /// Fetch all subscription plans
  Future<void> fetchSubscriptionPlans({bool forceRefresh = false}) async {
    if (_plans.isNotEmpty && !forceRefresh) {
      return;
    }

    _setLoading(true);
    _clearError();

    try {
      final plans = await _subscriptionService.getSubscriptionPlans();
      _plans = plans.map((p) => Map<String, dynamic>.from(p)).toList();
      notifyListeners();
    } on ApiException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to fetch subscription plans');
    } finally {
      _setLoading(false);
    }
  }

  /// Fetch a specific plan by ID
  Future<Map<String, dynamic>?> fetchPlanById(
    String planId, {
    bool forceRefresh = false,
  }) async {
    // Check cache first
    if (!forceRefresh) {
      final cached = _plans.firstWhere(
        (plan) => (plan['planId'] ?? plan['id']) == planId,
        orElse: () => <String, dynamic>{},
      );
      if (cached.isNotEmpty) {
        _selectedPlan = cached;
        return cached;
      }
    }

    _setLoading(true);
    _clearError();

    try {
      final plan = await _subscriptionService.getSubscriptionPlanById(planId);
      _selectedPlan = Map<String, dynamic>.from(plan);
      
      // Update cache
      final index = _plans.indexWhere(
        (p) => (p['planId'] ?? p['id']) == planId,
      );
      if (index != -1) {
        _plans[index] = _selectedPlan!;
      } else {
        _plans.add(_selectedPlan!);
      }
      
      notifyListeners();
      return _selectedPlan;
    } on ApiException catch (e) {
      _setError(e.message);
      return null;
    } catch (e) {
      _setError('Failed to fetch plan details');
      return null;
    } finally {
      _setLoading(false);
    }
  }

  /// Initiate subscription purchase
  /// Returns payment data to continue with payment flow
  Future<Map<String, dynamic>?> initiateSubscription(
    String planId, {
    String? subscriptionType,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final result = await _subscriptionService.initiateSubscription(
        planId,
        subscriptionType: subscriptionType,
      );
      
      _initiatedSubscription = Map<String, dynamic>.from(result);
      
      // Normalize paymentId field
      _initiatedSubscription = {
        ..._initiatedSubscription!,
        'paymentId': _initiatedSubscription!['paymentId'] ?? 
                     _initiatedSubscription!['id'] ?? 
                     _initiatedSubscription!['_id'],
      };
      
      notifyListeners();
      return _initiatedSubscription;
    } on ApiException catch (e) {
      _setError(e.message);
      return null;
    } catch (e) {
      _setError('Failed to initiate subscription');
      return null;
    } finally {
      _setLoading(false);
    }
  }

  /// Clear selected plan
  void clearSelectedPlan() {
    _selectedPlan = null;
    notifyListeners();
  }

  /// Clear initiated subscription
  void clearInitiatedSubscription() {
    _initiatedSubscription = null;
    notifyListeners();
  }

  /// Refresh plans cache
  Future<void> refreshPlans() async {
    await fetchSubscriptionPlans(forceRefresh: true);
  }

  // Private helpers
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String message) {
    _error = message;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
  }
}
