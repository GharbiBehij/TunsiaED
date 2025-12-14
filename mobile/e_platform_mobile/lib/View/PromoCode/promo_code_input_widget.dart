import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../ViewModel/PromoCode/promo_code_viewmodel.dart';

/// PromoCodeInputWidget
/// UI component for promo code input and validation
class PromoCodeInputWidget extends StatefulWidget {
  final double subtotal;
  final String? courseId;
  final Function(double discount)? onPromoApplied;
  final Function()? onPromoRemoved;

  const PromoCodeInputWidget({
    Key? key,
    required this.subtotal,
    this.courseId,
    this.onPromoApplied,
    this.onPromoRemoved,
  }) : super(key: key);

  @override
  State<PromoCodeInputWidget> createState() => _PromoCodeInputWidgetState();
}

class _PromoCodeInputWidgetState extends State<PromoCodeInputWidget> {
  final TextEditingController _promoCodeController = TextEditingController();
  bool _expanded = false;

  @override
  void dispose() {
    _promoCodeController.dispose();
    super.dispose();
  }

  void _handleApplyPromo(PromoCodeViewModel viewModel) async {
    if (_promoCodeController.text.trim().isEmpty) {
      return;
    }

    final isValid = await viewModel.validatePromoCode(
      code: _promoCodeController.text.trim(),
      subtotal: widget.subtotal,
      courseId: widget.courseId,
    );

    if (isValid) {
      final discount = viewModel.getDiscountAmount();
      widget.onPromoApplied?.call(discount);
      
      // Show success message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Promo code applied! Discount: \$${discount.toStringAsFixed(2)}'),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 2),
          ),
        );
      }
    }
  }

  void _handleRemovePromo(PromoCodeViewModel viewModel) {
    viewModel.clearValidatedPromo();
    _promoCodeController.clear();
    widget.onPromoRemoved?.call();
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Promo code removed'),
          duration: Duration(seconds: 1),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<PromoCodeViewModel>(
      builder: (context, viewModel, child) {
        final isPromoApplied = viewModel.isPromoApplied;
        final discount = viewModel.getDiscountAmount();

        return Card(
          elevation: 2,
          margin: const EdgeInsets.symmetric(vertical: 8),
          child: Column(
            children: [
              // Header
              InkWell(
                onTap: () {
                  if (!isPromoApplied) {
                    setState(() => _expanded = !_expanded);
                  }
                },
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Icon(
                        Icons.local_offer,
                        color: isPromoApplied ? Colors.green : Colors.grey,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          isPromoApplied
                              ? 'Promo Code Applied'
                              : 'Have a promo code?',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: isPromoApplied
                                ? FontWeight.w600
                                : FontWeight.w500,
                            color: isPromoApplied ? Colors.green : Colors.black87,
                          ),
                        ),
                      ),
                      if (isPromoApplied)
                        Text(
                          '-\$${discount.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.green,
                          ),
                        ),
                      const SizedBox(width: 8),
                      Icon(
                        isPromoApplied
                            ? Icons.check_circle
                            : (_expanded ? Icons.expand_less : Icons.expand_more),
                        color: isPromoApplied ? Colors.green : Colors.grey,
                      ),
                    ],
                  ),
                ),
              ),

              // Promo applied display
              if (isPromoApplied)
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          'Code: ${_promoCodeController.text}',
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      TextButton.icon(
                        onPressed: () => _handleRemovePromo(viewModel),
                        icon: const Icon(Icons.close, size: 18),
                        label: const Text('Remove'),
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.red,
                        ),
                      ),
                    ],
                  ),
                ),

              // Input field (expanded state)
              if (_expanded && !isPromoApplied)
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _promoCodeController,
                              decoration: InputDecoration(
                                hintText: 'Enter promo code',
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 12,
                                ),
                                errorText: viewModel.error,
                              ),
                              textCapitalization: TextCapitalization.characters,
                              enabled: !viewModel.isLoading,
                            ),
                          ),
                          const SizedBox(width: 8),
                          ElevatedButton(
                            onPressed: viewModel.isLoading
                                ? null
                                : () => _handleApplyPromo(viewModel),
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 24,
                                vertical: 14,
                              ),
                            ),
                            child: viewModel.isLoading
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                    ),
                                  )
                                : const Text('Apply'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}
