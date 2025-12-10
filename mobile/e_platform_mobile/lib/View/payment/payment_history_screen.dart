import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../ViewModel/payment/payment_viewmodel.dart';
import '../../core/utils/constants.dart';
import '../../core/utils/utils.dart';

/// Payment History Screen
/// Displays all user payments with filtering by status
class PaymentHistoryScreen extends StatefulWidget {
  const PaymentHistoryScreen({Key? key}) : super(key: key);

  @override
  State<PaymentHistoryScreen> createState() => _PaymentHistoryScreenState();
}

class _PaymentHistoryScreenState extends State<PaymentHistoryScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedStatus = 'all';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _loadPayments();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadPayments({bool forceRefresh = false}) async {
    final viewModel = context.read<PaymentViewModel>();
    await viewModel.fetchMyPayments(forceRefresh: forceRefresh);
  }

  List<Map<String, dynamic>> _filterPayments(
    List<Map<String, dynamic>> payments,
    String status,
  ) {
    if (status == 'all') return payments;
    return payments
        .where((p) => (p['status'] ?? '').toString().toLowerCase() == status)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment History'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          onTap: (index) {
            setState(() {
              _selectedStatus = ['all', 'completed', 'pending', 'failed'][index];
            });
          },
          tabs: const [
            Tab(text: 'All'),
            Tab(text: 'Completed'),
            Tab(text: 'Pending'),
            Tab(text: 'Failed'),
          ],
        ),
      ),
      body: Consumer<PaymentViewModel>(
        builder: (context, viewModel, _) {
          if (viewModel.isLoading && viewModel.payments.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          if (viewModel.error != null && viewModel.payments.isEmpty) {
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
                    onPressed: () => _loadPayments(forceRefresh: true),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          final filteredPayments = _filterPayments(
            viewModel.payments,
            _selectedStatus,
          );

          if (filteredPayments.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.receipt_long_outlined,
                    size: 64,
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _selectedStatus == 'all'
                        ? 'No payments yet'
                        : 'No $_selectedStatus payments',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => _loadPayments(forceRefresh: true),
            child: ListView.separated(
              padding: const EdgeInsets.all(AppConstants.defaultPadding),
              itemCount: filteredPayments.length,
              separatorBuilder: (_, __) =>
                  const SizedBox(height: AppConstants.defaultPadding),
              itemBuilder: (context, index) {
                final payment = filteredPayments[index];
                return _buildPaymentCard(payment);
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildPaymentCard(Map<String, dynamic> payment) {
    final paymentId = payment['paymentId'] ?? payment['id'];
    final courseTitle = payment['courseTitle'] ?? 'Course Purchase';
    final amount = payment['amount']?.toDouble() ?? 0.0;
    final status = (payment['status'] ?? 'pending').toString().toLowerCase();
    final paymentMethod = payment['paymentMethod'] ?? 'N/A';
    final createdAt = payment['createdAt']?.toString();
    final currency = payment['currency'] ?? 'TND';

    Color statusColor;
    IconData statusIcon;
    switch (status) {
      case 'completed':
        statusColor = Colors.green;
        statusIcon = Icons.check_circle;
        break;
      case 'pending':
        statusColor = Colors.orange;
        statusIcon = Icons.schedule;
        break;
      case 'failed':
        statusColor = Colors.red;
        statusIcon = Icons.error;
        break;
      default:
        statusColor = Colors.grey;
        statusIcon = Icons.help_outline;
    }

    return Card(
      child: InkWell(
        onTap: () => _showPaymentDetails(payment),
        child: Padding(
          padding: const EdgeInsets.all(AppConstants.defaultPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      courseTitle,
                      style: Theme.of(context).textTheme.titleMedium,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Icon(
                    statusIcon,
                    color: statusColor,
                    size: 20,
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '$amount $currency',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          color: Theme.of(context).primaryColor,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      status.toUpperCase(),
                      style: TextStyle(
                        color: statusColor,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(
                    Icons.payment,
                    size: 16,
                    color: Colors.grey[600],
                  ),
                  const SizedBox(width: 4),
                  Text(
                    paymentMethod,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(width: 16),
                  Icon(
                    Icons.access_time,
                    size: 16,
                    color: Colors.grey[600],
                  ),
                  const SizedBox(width: 4),
                  Text(
                    createdAt != null
                        ? _formatDateString(createdAt)
                        : 'N/A',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showPaymentDetails(Map<String, dynamic> payment) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        expand: false,
        builder: (context, scrollController) {
          return Padding(
            padding: const EdgeInsets.all(AppConstants.defaultPadding),
            child: ListView(
              controller: scrollController,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Payment Details',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const Divider(),
                _buildDetailRow('Payment ID', payment['paymentId'] ?? payment['id']),
                _buildDetailRow('Course', payment['courseTitle'] ?? 'N/A'),
                _buildDetailRow(
                  'Amount',
                  '${payment['amount']} ${payment['currency'] ?? 'TND'}',
                ),
                _buildDetailRow('Status', payment['status'] ?? 'N/A'),
                _buildDetailRow('Payment Method', payment['paymentMethod'] ?? 'N/A'),
                if (payment['transactionId'] != null)
                  _buildDetailRow('Transaction ID', payment['transactionId']),
                if (payment['stripeSessionId'] != null)
                  _buildDetailRow('Stripe Session', payment['stripeSessionId']),
                _buildDetailRow(
                  'Created At',
                  payment['createdAt'] != null
                      ? _formatDateString(payment['createdAt'])
                      : 'N/A',
                ),
                if (payment['completedAt'] != null)
                  _buildDetailRow(
                    'Completed At',
                    _formatDateString(payment['completedAt']),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildDetailRow(String label, String? value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 140,
            child: Text(
              label,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
          ),
          Expanded(
            child: Text(
              value ?? 'N/A',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDateString(String dateString) {
    try {
      final dateTime = DateTime.parse(dateString);
      return Utils.formatDate(dateTime);
    } catch (e) {
      return dateString; // Return as-is if parsing fails
    }
  }
}
