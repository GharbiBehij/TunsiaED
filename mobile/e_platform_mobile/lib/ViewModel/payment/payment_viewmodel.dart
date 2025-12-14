import 'package:flutter/foundation.dart';
import '../../Service/Payment/payment_service.dart';
import '../../core/api/api_client.dart';

/// Payment ViewModel
/// Coordinates orchestrated purchase flows, Stripe gateway interactions, and local caches
class PaymentViewModel extends ChangeNotifier {
  final PaymentService _paymentService = PaymentService();

  // Base payment collections
  List<Map<String, dynamic>> _payments = [];
  final Map<String, List<Map<String, dynamic>>> _paymentsByStatusCache = {};
  final Map<String, List<Map<String, dynamic>>> _coursePaymentsCache = {};
  final Map<String, Map<String, dynamic>> _purchaseStatusCache = {};
  final Map<String, Map<String, dynamic>> _stripeStatusCache = {};

  // Active flow state
  Map<String, dynamic>? _currentPurchase;
  Map<String, dynamic>? _purchaseSummary;
  Map<String, dynamic>? _purchaseResult;
  Map<String, dynamic>? _stripeCheckout;
  Map<String, dynamic>? _stripeStatus;
  Map<String, dynamic>? _simulationResult;

  // UI state
  bool _isLoading = false;
  bool _isStripeLoading = false;
  String? _error;
  String? _stripeError;

  // Getters
  List<Map<String, dynamic>> get payments => _payments;
  Map<String, dynamic>? get currentPurchase => _currentPurchase;
  Map<String, dynamic>? get currentPayment => _currentPurchase; // Backward compatibility
  Map<String, dynamic>? get purchaseStatus => _purchaseSummary;
  Map<String, dynamic>? get paymentStatus => _purchaseSummary; // Backward compatibility
  Map<String, dynamic>? get purchaseResult => _purchaseResult;
  Map<String, dynamic>? get stripeCheckout => _stripeCheckout;
  Map<String, dynamic>? get stripePaymentStatus => _stripeStatus;
  Map<String, dynamic>? get simulationResult => _simulationResult;
  bool get isLoading => _isLoading;
  bool get isStripeLoading => _isStripeLoading;
  String? get error => _error;
  String? get stripeError => _stripeError;

  List<Map<String, dynamic>> paymentsByStatus(String status) =>
      _paymentsByStatusCache[status] ?? const <Map<String, dynamic>>[];

  List<Map<String, dynamic>> coursePayments(String courseId) =>
      _coursePaymentsCache[courseId] ?? const <Map<String, dynamic>>[];

  // ========== Purchase Flow (Orchestrated) ==========

  Future<Map<String, dynamic>?> initiatePurchase(
    Map<String, dynamic> data,
  ) async {
    _setLoading(true);
    _clearError();

    try {
      final result = await _paymentService.initiatePurchase(data);
      _currentPurchase = Map<String, dynamic>.from(result);
      _upsertPayment(_currentPurchase!);
      notifyListeners();
      return _currentPurchase;
    } on ApiException catch (e) {
      _setError(e.message);
      return null;
    } finally {
      _setLoading(false);
    }
  }

  @Deprecated('Use initiatePurchase() instead')
  Future<Map<String, dynamic>?> initiatePayment(
    Map<String, dynamic> data,
  ) {
    return initiatePurchase(data);
  }

  Future<Map<String, dynamic>?> completePurchase(
    Map<String, dynamic> confirmationData,
  ) async {
    _setLoading(true);
    _clearError();

    final paymentId = confirmationData['paymentId']?.toString();

    try {
      final result = await _paymentService.completePurchase(confirmationData);
      _purchaseResult = Map<String, dynamic>.from(result);

      if (paymentId != null) {
        _updatePaymentStatusLocally(paymentId, 'completed');
        try {
          final status = await _paymentService.getPurchaseStatus(paymentId);
          _cachePurchaseStatus(paymentId, status);
        } on ApiException {
          // Keep optimistic state if status fetch fails
        }
      }

      notifyListeners();
      return _purchaseResult;
    } on ApiException catch (e) {
      _setError(e.message);
      return null;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> completePayment(
    String paymentId,
    Map<String, dynamic> data,
  ) async {
    final confirmationData = <String, dynamic>{
      'paymentId': paymentId,
      'gatewayTransactionId': data['gatewayTransactionId'] ??
          data['transactionId'] ??
          'manual-${DateTime.now().millisecondsSinceEpoch}',
      'paymentGateway':
          data['paymentGateway'] ?? data['paymentMethod'] ?? 'manual',
    };

    final result = await completePurchase(confirmationData);
    return result != null;
  }

  Future<Map<String, dynamic>?> fetchPurchaseStatus(
    String paymentId, {
    bool forceRefresh = false,
  }) async {
    if (_purchaseStatusCache.containsKey(paymentId) && !forceRefresh) {
      _purchaseSummary = _purchaseStatusCache[paymentId];
      return _purchaseSummary;
    }

    _setLoading(true);
    _clearError();

    try {
      final status = await _paymentService.getPurchaseStatus(paymentId);
      _cachePurchaseStatus(paymentId, status);
      notifyListeners();
      return _purchaseSummary;
    } on ApiException catch (e) {
      _setError(e.message);
      return null;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> fetchPaymentStatus(
    String paymentId, {
    bool forceRefresh = false,
  }) async {
    await fetchPurchaseStatus(paymentId, forceRefresh: forceRefresh);
  }

  Future<Map<String, dynamic>?> fetchPaymentById(
    String paymentId, {
    bool forceRefresh = false,
  }) async {
    if (!forceRefresh) {
      final existing = _payments.firstWhere(
        (payment) => _extractPaymentId(payment) == paymentId,
        orElse: () => <String, dynamic>{},
      );
      if (existing.isNotEmpty) {
        return Map<String, dynamic>.from(existing);
      }
    }

    _setLoading(true);
    _clearError();

    try {
      final result = await _paymentService.getPaymentById(paymentId);
      final parsed = Map<String, dynamic>.from(result);
      _upsertPayment(parsed);
      notifyListeners();
      return parsed;
    } on ApiException catch (e) {
      _setError(e.message);
      return null;
    } finally {
      _setLoading(false);
    }
  }

  Future<List<Map<String, dynamic>>> fetchMyPayments({
    bool forceRefresh = false,
  }) async {
    if (_payments.isNotEmpty && !forceRefresh) {
      return _clonePaymentList(_payments);
    }

    _setLoading(true);
    _clearError();

    try {
      final payments = await _paymentService.getMyPayments();
      _setPayments(payments);
      notifyListeners();
      return _clonePaymentList(_payments);
    } on ApiException catch (e) {
      _setError(e.message);
      return const <Map<String, dynamic>>[];
    } finally {
      _setLoading(false);
    }
  }

  Future<void> fetchPayments({bool forceRefresh = false}) async {
    await fetchMyPayments(forceRefresh: forceRefresh);
  }

  Future<List<Map<String, dynamic>>> fetchPaymentsByStatus(
    String status, {
    bool forceRefresh = false,
  }) async {
    if (!forceRefresh && _paymentsByStatusCache.containsKey(status)) {
      return _clonePaymentList(_paymentsByStatusCache[status]!);
    }

    _setLoading(true);
    _clearError();

    try {
      final payments = await _paymentService.getPaymentsByStatus(status);
      final parsed = _clonePaymentList(payments);
      _paymentsByStatusCache[status] = parsed;
      notifyListeners();
      return _clonePaymentList(parsed);
    } on ApiException catch (e) {
      _setError(e.message);
      return const <Map<String, dynamic>>[];
    } finally {
      _setLoading(false);
    }
  }

  Future<List<Map<String, dynamic>>> fetchCoursePayments(
    String courseId, {
    bool forceRefresh = false,
  }) async {
    if (!forceRefresh && _coursePaymentsCache.containsKey(courseId)) {
      return _clonePaymentList(_coursePaymentsCache[courseId]!);
    }

    _setLoading(true);
    _clearError();

    try {
      final payments = await _paymentService.getCoursePayments(courseId);
      final parsed = _clonePaymentList(payments);
      _coursePaymentsCache[courseId] = parsed;
      notifyListeners();
      return _clonePaymentList(parsed);
    } on ApiException catch (e) {
      _setError(e.message);
      return const <Map<String, dynamic>>[];
    } finally {
      _setLoading(false);
    }
  }

  // ========== Stripe Gateway ==========

  Future<Map<String, dynamic>?> initiateStripePayment(
    Map<String, dynamic> data,
  ) async {
    _setStripeLoading(true);
    _clearStripeError();

    try {
      final result = await _paymentService.initiateStripePayment(data);
      _stripeCheckout = Map<String, dynamic>.from(result);
      final paymentId = _stripeCheckout?['paymentId']?.toString();
      if (paymentId != null) {
        final pending = <String, dynamic>{
          'paymentId': paymentId,
          'status': 'pending',
          'amount': _stripeCheckout?['amount'],
          'paymentMethod': 'stripe',
        };
        _currentPurchase = {
          ...pending,
          'sessionId': _stripeCheckout?['sessionId'],
        };
        _upsertPayment(pending);
      }
      notifyListeners();
      return _stripeCheckout;
    } on ApiException catch (e) {
      _setStripeError(e.message);
      return null;
    } finally {
      _setStripeLoading(false);
    }
  }

  Future<Map<String, dynamic>?> fetchStripePaymentStatus(
    String sessionId, {
    bool forceRefresh = false,
  }) async {
    if (!forceRefresh && _stripeStatusCache.containsKey(sessionId)) {
      _stripeStatus = _stripeStatusCache[sessionId];
      return _stripeStatus;
    }

    _setStripeLoading(true);
    _clearStripeError();

    try {
      final result = await _paymentService.getStripePaymentStatus(sessionId);
      final parsed = Map<String, dynamic>.from(result);
      _stripeStatusCache[sessionId] = parsed;
      _stripeStatus = parsed;

      final paymentId = parsed['paymentId']?.toString();
      final status = parsed['status']?.toString();
      if (paymentId != null && status != null) {
        _updatePaymentStatusLocally(paymentId, status);
      }

      notifyListeners();
      return _stripeStatus;
    } on ApiException catch (e) {
      _setStripeError(e.message);
      return null;
    } finally {
      _setStripeLoading(false);
    }
  }

  // ========== Simulation / Testing ==========

  Future<Map<String, dynamic>?> simulatePayment(
    Map<String, dynamic> data,
  ) async {
    _setLoading(true);
    _clearError();

    try {
      final result = await _paymentService.simulatePayment(data);
      _simulationResult = Map<String, dynamic>.from(result);
      final paymentId = _simulationResult?['paymentId']?.toString();
      if (paymentId != null) {
        await fetchPurchaseStatus(paymentId, forceRefresh: true);
      }
      notifyListeners();
      return _simulationResult;
    } on ApiException catch (e) {
      _setError(e.message);
      return null;
    } finally {
      _setLoading(false);
    }
  }

  // ========== Mutations ==========

  Future<bool> cancelPayment(String paymentId) async {
    _setLoading(true);
    _clearError();

    try {
      await _paymentService.cancelPayment(paymentId);
      _updatePaymentStatusLocally(paymentId, 'cancelled');
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> refundPayment(String paymentId) async {
    _setLoading(true);
    _clearError();

    try {
      await _paymentService.refundPayment(paymentId);
      _updatePaymentStatusLocally(paymentId, 'refunded');
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _setError(e.message);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // ========== Clear Helpers ==========

  void clearStripeSession() {
    _stripeCheckout = null;
    _stripeStatus = null;
    _stripeStatusCache.clear();
    notifyListeners();
  }

  void clearCurrentPayment() {
    _currentPurchase = null;
    _purchaseSummary = null;
    _purchaseResult = null;
    notifyListeners();
  }

  void clear() {
    _payments = [];
    _paymentsByStatusCache.clear();
    _coursePaymentsCache.clear();
    _purchaseStatusCache.clear();
    _stripeStatusCache.clear();
    _currentPurchase = null;
    _purchaseSummary = null;
    _purchaseResult = null;
    _stripeCheckout = null;
    _stripeStatus = null;
    _simulationResult = null;
    _isLoading = false;
    _isStripeLoading = false;
    _error = null;
    _stripeError = null;
    notifyListeners();
  }

  // ========== Internal Helpers ==========

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setStripeLoading(bool value) {
    _isStripeLoading = value;
    notifyListeners();
  }

  void _setError(String message) {
    _error = message;
    notifyListeners();
  }

  void _setStripeError(String message) {
    _stripeError = message;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
  }

  void _clearStripeError() {
    _stripeError = null;
  }

  void _setPayments(List<Map<String, dynamic>> payments) {
    _payments = _clonePaymentList(payments);
    _rebuildPaymentCaches();
  }

  void _rebuildPaymentCaches() {
    _paymentsByStatusCache.clear();
    for (final payment in _payments) {
      final status = (payment['status'] ?? '').toString();
      if (status.isEmpty) {
        continue;
      }
      final list = _paymentsByStatusCache.putIfAbsent(
        status,
        () => <Map<String, dynamic>>[],
      );
      list.add(payment);
    }
  }

  List<Map<String, dynamic>> _clonePaymentList(
    Iterable<Map<String, dynamic>> source,
  ) {
    return source.map((item) => Map<String, dynamic>.from(item)).toList();
  }

  String? _extractPaymentId(Map<String, dynamic> payment) {
    final value = payment['paymentId'] ?? payment['id'];
    return value?.toString();
  }

  void _upsertPayment(Map<String, dynamic> payment) {
    final paymentId = _extractPaymentId(payment);
    if (paymentId == null) {
      return;
    }

    final normalized = Map<String, dynamic>.from(payment);

    final index = _payments.indexWhere(
      (existing) => _extractPaymentId(existing) == paymentId,
    );

    if (index == -1) {
      _payments.insert(0, normalized);
    } else {
      _payments[index] = {
        ..._payments[index],
        ...normalized,
      };
    }

    if (_currentPurchase != null &&
        _extractPaymentId(_currentPurchase!) == paymentId) {
      _currentPurchase = {
        ..._currentPurchase!,
        ...normalized,
      };
    }

    _rebuildPaymentCaches();
  }

  void _cachePurchaseStatus(String paymentId, Map<String, dynamic> status) {
    final parsed = Map<String, dynamic>.from(status);
    _purchaseStatusCache[paymentId] = parsed;
    _purchaseSummary = parsed;

    final payment = parsed['payment'];
    if (payment is Map<String, dynamic>) {
      _upsertPayment(Map<String, dynamic>.from(payment));
    }
  }

  void _updatePaymentStatusLocally(String paymentId, String status) {
    final cached = _purchaseStatusCache[paymentId];
    if (cached != null) {
      final payment =
          (cached['payment'] as Map?)?.cast<String, dynamic>() ?? <String, dynamic>{};
      payment['status'] = status;
      cached['payment'] = payment;
      _purchaseStatusCache[paymentId] = Map<String, dynamic>.from(cached);
      if (_purchaseSummary != null &&
          _extractPaymentId(
                (_purchaseSummary!['payment'] as Map?)?.cast<String, dynamic>() ??
                    <String, dynamic>{},
              ) ==
              paymentId) {
        _purchaseSummary = _purchaseStatusCache[paymentId];
      }
    }

    final index = _payments.indexWhere(
      (existing) => _extractPaymentId(existing) == paymentId,
    );

    if (index != -1) {
      _payments[index] = {
        ..._payments[index],
        'status': status,
      };
    }

    if (_currentPurchase != null &&
        _extractPaymentId(_currentPurchase!) == paymentId) {
      _currentPurchase = {
        ..._currentPurchase!,
        'status': status,
      };
    }

    _rebuildPaymentCaches();
  }
}
