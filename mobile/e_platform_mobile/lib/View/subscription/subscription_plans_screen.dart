import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../ViewModel/subscription/subscription_viewmodel.dart';
import '../../core/utils/constants.dart';
import '../../core/utils/utils.dart';
import '../payment/payment_screen.dart';

/// Subscription Plans Screen
/// Displays available subscription plans for purchase
class SubscriptionPlansScreen extends StatefulWidget {
  const SubscriptionPlansScreen({Key? key}) : super(key: key);

  @override
  State<SubscriptionPlansScreen> createState() =>
      _SubscriptionPlansScreenState();
}

class _SubscriptionPlansScreenState extends State<SubscriptionPlansScreen> {
  @override
  void initState() {
    super.initState();
    _loadPlans();
  }

  Future<void> _loadPlans({bool forceRefresh = false}) async {
    final viewModel = context.read<SubscriptionViewModel>();
    await viewModel.fetchSubscriptionPlans(forceRefresh: forceRefresh);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Subscription Plans'),
      ),
      body: Consumer<SubscriptionViewModel>(
        builder: (context, viewModel, _) {
          if (viewModel.isLoading && viewModel.plans.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          if (viewModel.error != null && viewModel.plans.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.error_outline,
                    size: 64,
                    color: Colors.red,
                  ),
                  const SizedBox(height: 16),
                  Text(viewModel.error!),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => _loadPlans(forceRefresh: true),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          if (viewModel.plans.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.card_membership,
                    size: 64,
                    color: Colors.grey,
                  ),
                  SizedBox(height: 16),
                  Text('No subscription plans available'),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => _loadPlans(forceRefresh: true),
            child: ListView.separated(
              padding: const EdgeInsets.all(AppConstants.defaultPadding),
              itemCount: viewModel.plans.length,
              separatorBuilder: (_, __) =>
                  const SizedBox(height: AppConstants.largePadding),
              itemBuilder: (context, index) {
                final plan = viewModel.plans[index];
                return _buildPlanCard(plan);
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildPlanCard(Map<String, dynamic> plan) {
    final planId = plan['planId'] ?? plan['id'];
    final name = plan['name'] ?? 'Subscription Plan';
    final description = plan['description'] ?? '';
    final price = plan['price']?.toDouble() ?? 0.0;
    final duration = plan['duration'] ?? 'monthly';
    final features = plan['features'] as List? ?? [];
    final isPopular = plan['isPopular'] == true;
    final currency = plan['currency'] ?? 'TND';

    return Card(
      elevation: isPopular ? 8 : 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: isPopular
            ? BorderSide(
                color: Theme.of(context).primaryColor,
                width: 2,
              )
            : BorderSide.none,
      ),
      child: Column(
        children: [
          if (isPopular)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(14),
                  topRight: Radius.circular(14),
                ),
              ),
              child: const Text(
                'MOST POPULAR',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(AppConstants.largePadding),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Plan Name
                Text(
                  name,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),

                // Duration Badge
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    duration.toUpperCase(),
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Price
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '$price',
                      style: Theme.of(context).textTheme.displaySmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).primaryColor,
                          ),
                    ),
                    const SizedBox(width: 4),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Text(
                        '$currency/$duration',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Description
                if (description.isNotEmpty) ...[
                  Text(
                    description,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 16),
                ],

                // Features
                if (features.isNotEmpty) ...[
                  const Text(
                    'Features:',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...features.map((feature) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          children: [
                            Icon(
                              Icons.check_circle,
                              color: Theme.of(context).primaryColor,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                feature.toString(),
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                            ),
                          ],
                        ),
                      )),
                  const SizedBox(height: 16),
                ],

                // Subscribe Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => _handleSubscribe(planId, name, price, duration),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: isPopular
                          ? Theme.of(context).primaryColor
                          : null,
                    ),
                    child: const Text('Subscribe Now'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _handleSubscribe(
    String planId,
    String planName,
    double price,
    String duration,
  ) async {
    // Show confirmation dialog
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Subscription'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('You are about to subscribe to:'),
            const SizedBox(height: 12),
            Text(
              planName,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            const SizedBox(height: 8),
            Text('$price TND / $duration'),
            const SizedBox(height: 16),
            const Text(
              'You will be redirected to the payment page to complete your subscription.',
              style: TextStyle(fontSize: 12),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Continue'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    // Initiate subscription
    final viewModel = context.read<SubscriptionViewModel>();
    final result = await viewModel.initiateSubscription(
      planId,
      subscriptionType: duration,
    );

    if (!mounted) return;

    if (result == null) {
      Utils.showMessage(
        context,
        viewModel.error ?? 'Failed to initiate subscription',
        isError: true,
      );
      return;
    }

    // Navigate to payment screen with subscription data
    final paymentResult = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => PaymentScreen(
          courseId: planId, // Using planId as courseId for compatibility
          courseTitle: 'Subscription: $planName',
          price: price,
        ),
      ),
    );

    if (paymentResult == true && mounted) {
      Utils.showMessage(
        context,
        'Subscription activated successfully!',
      );
      Navigator.pop(context); // Return to previous screen
    }
  }
}
