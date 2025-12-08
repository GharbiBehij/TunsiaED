import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../ViewModel/Payment/payment_viewmodel.dart';
import '../../ViewModel/PromoCode/promo_code_viewmodel.dart';
import '../../core/utils/constants.dart';
import '../../core/utils/utils.dart';
import '../PromoCode/promo_code_input_widget.dart';

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
  String _selectedPaymentMethod = 'card'; 
  final _cardNumberController = TextEditingController();
  final _expiryController = TextEditingController();
  final _cvvController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  double _discountAmount = 0.0;

  @override
  void dispose() {
    _cardNumberController.dispose();
    _expiryController.dispose();
    _cvvController.dispose();
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

    // Initiate payment
    final purchase = await paymentViewModel.initiatePurchase({
      'courseId': widget.courseId,
      'paymentType': 'course_purchase',
      'paymentMethod': _selectedPaymentMethod,
      'amount': _finalAmount,
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

    // Complete payment
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

              // Payment Method
              Text(
                'Payment Method',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: AppConstants.defaultPadding),

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

              // Card Details (if card selected)
              if (_selectedPaymentMethod == 'card') ...[
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
            ],
          ),
        ),
      ),
      bottomNavigationBar: Consumer<PaymentViewModel>(
        builder: (context, viewModel, _) {
          return SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(AppConstants.defaultPadding),
              child: ElevatedButton(
                onPressed: viewModel.isLoading ? null : _handlePayment,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: viewModel.isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Text('Pay ${Utils.formatCurrency(_finalAmount)}'),
              ),
            ),
          );
        },
      ),
    );
  }
}
