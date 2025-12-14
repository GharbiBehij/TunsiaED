import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import '../../ViewModel/Payment/payment_viewmodel.dart';
import '../../ViewModel/PromoCode/promo_code_viewmodel.dart';
import '../../core/utils/constants.dart';
import '../../core/utils/utils.dart';
import '../PromoCode/promo_code_input_widget.dart';
import 'stripe_webview_screen.dart';

/// Payment Screen
/// Handles course payment flow
class PaymentScreen extends StatefulWidget {
  final String courseId;
  final String courseTitle;
  final double price;

  const PaymentScreen({
    Key? key,
    required this.courseId,
    required this.courseTitle,
    required this.price,
  }) : super(key: key);

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  String _selectedPaymentMethod = 'stripe'; // Default to Stripe (matches web)
  final _cardNumberController = TextEditingController();
  final _expiryController = TextEditingController();
  final _cvvController = TextEditingController();
  final _phoneController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  double _discountAmount = 0.0;
  bool _isTestMode = false; // Test mode for when gateway is unavailable
  bool _simulateSuccess = true; // For test mode
  Timer? _pollTimer; // Store timer reference for proper cleanup

  @override
  void dispose() {
    _pollTimer?.cancel(); // Cancel timer if still running
    _cardNumberController.dispose();
    _expiryController.dispose();
    _cvvController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  double get _finalAmount => widget.price - _discountAmount;

  void _handlePromoApplied(double discount) {
    setState(() {
      _discountAmount = discount;
    });
  }

  void _handlePromoRemoved() {
    setState(() {
      _discountAmount = 0.0;
    });
  }

  Future<void> _handlePayment() async {
    if (!_formKey.currentState!.validate()) return;

    final paymentViewModel =
        Provider.of<PaymentViewModel>(context, listen: false);

    // Get promo code if applied
    final promoViewModel = Provider.of<PromoCodeViewModel>(context, listen: false);
    final promoCode = promoViewModel.isPromoApplied 
        ? promoViewModel.validatedPromo?['promoCode']?.toString()
        : null;

    // Test mode - use simulation endpoint
    if (_isTestMode) {
      final result = await paymentViewModel.simulatePayment({
        'courseId': widget.courseId,
        'simulateSuccess': _simulateSuccess,
      });

      if (!mounted) return;

      if (result != null && result['success'] == true) {
        Utils.showMessage(context, 'Test payment successful! You are now enrolled.');
        Navigator.pop(context, true);
      } else {
        Utils.showMessage(
          context,
          'Test payment failed as configured.',
          isError: true,
        );
      }
      return;
    }

    // Step 1: Initiate purchase (creates payment record)
    final purchase = await paymentViewModel.initiatePurchase({
      'courseId': widget.courseId,
      'paymentType': 'course_purchase',
      'paymentMethod': _selectedPaymentMethod,
      if (promoCode != null) 'promoCode': promoCode,
    });

    if (purchase == null) {
      if (!mounted) return;
      Utils.showMessage(
        context,
        paymentViewModel.error ?? 'Payment initiation failed',
        isError: true,
      );
      return;
    }

    final paymentId =
        (purchase['paymentId'] ?? purchase['id'])?.toString();

    if (paymentId == null) {
      if (!mounted) return;
      Utils.showMessage(
        context,
        'Payment initiated but no identifier returned. Please try again.',
        isError: true,
      );
      return;
    }

    // Step 2: Handle Stripe payment flow
    if (_selectedPaymentMethod == 'stripe') {
      await _handleStripePayment(paymentId, paymentViewModel);
      return;
    }

    // Step 3: Standard payment flow (card/PayPal)
    final completion = await paymentViewModel.completePurchase({
      'paymentId': paymentId,
      'paymentGateway': _selectedPaymentMethod,
      'gatewayTransactionId': _buildGatewayTransactionId(),
    });

    if (!mounted) return;

    final success = completion != null && completion['success'] == true;

    if (success) {
      // Payment successful - enrollment is created by backend on payment completion
      final message = completion?['message'] as String? ??
          'Payment successful! You are now enrolled.';
      Utils.showMessage(context, message);
      
      // Pop with success flag to trigger course refresh
      Navigator.pop(context, true);
    } else {
      Utils.showMessage(
        context,
        paymentViewModel.error ??
            completion?['message'] ??
            'Payment failed',
        isError: true,
      );
    }
  }

  Future<void> _handleStripePayment(
    String paymentId,
    PaymentViewModel paymentViewModel,
  ) async {
    try {
      // Initiate Stripe payment with existing paymentId
      final stripeData = {
        'paymentId': paymentId, // Reuse existing payment record
        'courseId': widget.courseId,
        'amount': _finalAmount,
        'note': 'Course: ${widget.courseTitle}',
        'firstName': 'Customer', // Could get from user profile
        'lastName': 'User',
        'email': '', // Could get from user profile
        'phone': _phoneController.text.isNotEmpty 
            ? _phoneController.text 
            : '+21600000000',
      };

      final result = await paymentViewModel.initiateStripePayment(stripeData);

      if (result == null) {
        if (!mounted) return;
        Utils.showMessage(
          context,
          paymentViewModel.stripeError ?? 'Failed to initiate Stripe checkout',
          isError: true,
        );
        return;
      }

      final checkoutUrl = result['checkoutUrl']?.toString();
      final sessionId = result['sessionId']?.toString();

      if (checkoutUrl == null || sessionId == null) {
        if (!mounted) return;
        Utils.showMessage(
          context,
          'Invalid Stripe response',
          isError: true,
        );
        return;
      }

      // Open Stripe checkout in WebView
      if (!mounted) return;
      
      final webViewResult = await Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => StripeWebViewScreen(
            checkoutUrl: checkoutUrl,
            sessionId: sessionId,
            paymentId: paymentId,
          ),
        ),
      );

      if (!mounted) return;

      // Handle WebView result
      if (webViewResult != null && webViewResult is Map) {
        if (webViewResult['success'] == true) {
          // Start polling for payment status
          await _pollStripePaymentStatus(
            sessionId,
            paymentId,
            paymentViewModel,
          );
        } else if (webViewResult['canceled'] == true) {
          Utils.showMessage(
            context,
            'Payment canceled',
            isError: true,
          );
        }
      }
    } catch (error) {
      if (!mounted) return;
      Utils.showMessage(
        context,
        'Stripe payment error: ${error.toString()}',
        isError: true,
      );
    }
  }

  Future<void> _pollStripePaymentStatus(
    String sessionId,
    String paymentId,
    PaymentViewModel paymentViewModel,
  ) async {
    // Show loading dialog
    if (!mounted) return;
    
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => WillPopScope(
        onWillPop: () async => false,
        child: const AlertDialog(
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Verifying payment...'),
            ],
          ),
        ),
      ),
    );

    // Poll every 2 seconds for up to 30 seconds
    int attempts = 0;
    const maxAttempts = 15; // 15 attempts * 2 seconds = 30 seconds

    _pollTimer = Timer.periodic(const Duration(seconds: 2), (timer) async {
      attempts++;

      final status = await paymentViewModel.fetchStripePaymentStatus(
        sessionId,
        forceRefresh: true,
      );

      if (!mounted) {
        timer.cancel();
        _pollTimer = null;
        return;
      }

      if (status != null) {
        final paymentStatus = status['status']?.toString().toLowerCase();

        if (paymentStatus == 'completed') {
          timer.cancel();
          _pollTimer = null;
          Navigator.pop(context); // Close loading dialog

          Utils.showMessage(
            context,
            'Payment successful! You are now enrolled.',
          );
          Navigator.pop(context, true); // Close payment screen with success
          return;
        } else if (paymentStatus == 'failed') {
          timer.cancel();
          _pollTimer = null;
          Navigator.pop(context); // Close loading dialog

          Utils.showMessage(
            context,
            'Payment failed. Please try again.',
            isError: true,
          );
          return;
        }
      }

      // Timeout after max attempts
      if (attempts >= maxAttempts) {
        timer.cancel();
        _pollTimer = null;
        Navigator.pop(context); // Close loading dialog

        Utils.showMessage(
          context,
          'Payment verification timeout. Please check your enrollments.',
          isError: true,
        );
        Navigator.pop(context, false); // Close payment screen
      }
    });
  }

  String _buildGatewayTransactionId() {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    if (_selectedPaymentMethod == 'card') {
      final digits =
          _cardNumberController.text.replaceAll(RegExp(r'[^0-9]'), '');
      final lastFour = digits.length >= 4
          ? digits.substring(digits.length - 4)
          : 'card';
      return 'card-$lastFour-$timestamp';
    }
    return '${_selectedPaymentMethod}-$timestamp';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Order Summary
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(AppConstants.defaultPadding),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Order Summary',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const Divider(),
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(widget.courseTitle),
                        subtitle: const Text('Course Enrollment'),
                        trailing: Text(Utils.formatCurrency(widget.price)),
                      ),
                      if (_discountAmount > 0) ...[
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          title: const Text('Promo Discount'),
                          trailing: Text(
                            '-${Utils.formatCurrency(_discountAmount)}',
                            style: const TextStyle(color: Colors.green),
                          ),
                        ),
                      ],
                      const Divider(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Total',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          Text(
                            Utils.formatCurrency(_finalAmount),
                            style: Theme.of(context)
                                .textTheme
                                .titleLarge
                                ?.copyWith(
                                  color: Theme.of(context).primaryColor,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Promo Code Input
              PromoCodeInputWidget(
                subtotal: widget.price,
                courseId: widget.courseId,
                onPromoApplied: _handlePromoApplied,
                onPromoRemoved: _handlePromoRemoved,
              ),
              const SizedBox(height: AppConstants.largePadding),

              // Test Mode Toggle
              SwitchListTile(
                title: const Text('Test Mode'),
                subtitle: const Text('Use simulation when payment gateway is unavailable'),
                value: _isTestMode,
                onChanged: (value) {
                  setState(() {
                    _isTestMode = value;
                  });
                },
              ),
              if (_isTestMode) ...[
                const SizedBox(height: AppConstants.defaultPadding),
                SwitchListTile(
                  title: const Text('Simulate Success'),
                  subtitle: const Text('Toggle to test payment failure'),
                  value: _simulateSuccess,
                  onChanged: (value) {
                    setState(() {
                      _simulateSuccess = value;
                    });
                  },
                ),
              ],
              const SizedBox(height: AppConstants.largePadding),

              // Payment Method (only show if not in test mode)
              if (!_isTestMode) ...[
                Text(
                  'Payment Method',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: AppConstants.defaultPadding),

                RadioListTile<String>(
                  title: const Text('Stripe'),
                  subtitle: const Text('International payment gateway (Recommended)'),
                  value: 'stripe',
                  groupValue: _selectedPaymentMethod,
                  onChanged: (value) {
                    setState(() {
                      _selectedPaymentMethod = value!;
                    });
                  },
                ),
                RadioListTile<String>(
                  title: const Text('Credit/Debit Card'),
                  subtitle: const Text('Visa, Mastercard, Amex'),
                  value: 'card',
                  groupValue: _selectedPaymentMethod,
                  onChanged: (value) {
                    setState(() {
                      _selectedPaymentMethod = value!;
                    });
                  },
                ),
                RadioListTile<String>(
                  title: const Text('PayPal'),
                  subtitle: const Text('Pay with PayPal account'),
                  value: 'paypal',
                  groupValue: _selectedPaymentMethod,
                  onChanged: (value) {
                    setState(() {
                      _selectedPaymentMethod = value!;
                    });
                  },
                ),
                const SizedBox(height: AppConstants.defaultPadding),
              ],

              // Payment Details
              if (!_isTestMode) ...[
                // Stripe - requires phone only
                if (_selectedPaymentMethod == 'stripe') ...[
                  Text(
                    'Contact Information',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: AppConstants.defaultPadding),
                  TextFormField(
                    controller: _phoneController,
                    decoration: const InputDecoration(
                      labelText: 'Phone Number (optional)',
                      prefixIcon: Icon(Icons.phone),
                      hintText: '+216 XX XXX XXX',
                    ),
                    keyboardType: TextInputType.phone,
                  ),
                  const SizedBox(height: AppConstants.defaultPadding),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.info_outline, color: Colors.blue),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'You will be redirected to Stripe to complete your payment securely.',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],

                // Card Details (if card selected)
                if (_selectedPaymentMethod == 'card') ...[
                  Text(
                    'Card Details',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: AppConstants.defaultPadding),
                  TextFormField(
                    controller: _cardNumberController,
                    decoration: const InputDecoration(
                      labelText: 'Card Number',
                      prefixIcon: Icon(Icons.credit_card),
                    ),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter card number';
                      }
                      if (value.length < 16) {
                        return 'Invalid card number';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: AppConstants.defaultPadding),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _expiryController,
                          decoration: const InputDecoration(
                            labelText: 'Expiry (MM/YY)',
                            prefixIcon: Icon(Icons.calendar_today),
                          ),
                          keyboardType: TextInputType.datetime,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Required';
                            }
                            return null;
                          },
                        ),
                      ),
                      const SizedBox(width: AppConstants.defaultPadding),
                      Expanded(
                        child: TextFormField(
                          controller: _cvvController,
                          decoration: const InputDecoration(
                            labelText: 'CVV',
                            prefixIcon: Icon(Icons.lock_outline),
                          ),
                          keyboardType: TextInputType.number,
                          obscureText: true,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Required';
                            }
                            if (value.length < 3) {
                              return 'Invalid';
                            }
                            return null;
                          },
                        ),
                      ),
                    ],
                  ),
                ],

                // PayPal info
                if (_selectedPaymentMethod == 'paypal') ...[
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.info_outline, color: Colors.blue),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'You will be redirected to PayPal to complete your payment.',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ],
          ),
        ),
      ),
      bottomNavigationBar: Consumer<PaymentViewModel>(
        builder: (context, viewModel, _) {
          String buttonText = 'Pay ${Utils.formatCurrency(_finalAmount)}';
          if (_isTestMode) {
            buttonText = _simulateSuccess 
                ? 'Simulate Successful Payment' 
                : 'Simulate Failed Payment';
          } else if (_selectedPaymentMethod == 'stripe') {
            buttonText = 'Continue to Stripe';
          }

          return SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(AppConstants.defaultPadding),
              child: ElevatedButton(
                onPressed: (viewModel.isLoading || viewModel.isStripeLoading) 
                    ? null 
                    : _handlePayment,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: (viewModel.isLoading || viewModel.isStripeLoading)
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : Text(buttonText),
              ),
            ),
          );
        },
      ),
    );
  }
}
