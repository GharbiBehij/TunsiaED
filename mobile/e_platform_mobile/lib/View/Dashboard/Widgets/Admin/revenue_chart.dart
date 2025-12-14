/// Admin Revenue Chart Widget
import 'package:flutter/material.dart';
import '../../../core/utils/constants.dart';

class AdminRevenueChart extends StatelessWidget {
  final Map<String, dynamic>? data;

  const AdminRevenueChart({Key? key, this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final monthlyRevenue = (data?['monthly'] as List?) ?? [];
    final total = data?['total'] ?? 0;
    final growth = (data?['growth'] ?? 0.0).toDouble();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Revenue Overview',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '\$${total.toString()}',
                      style:
                          Theme.of(context).textTheme.headlineMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                    ),
                    Text(
                      'Total Revenue',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: growth >= 0
                        ? Colors.green.withOpacity(0.2)
                        : Colors.red.withOpacity(0.2),
                    borderRadius:
                        BorderRadius.circular(AppConstants.borderRadius),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        growth >= 0 ? Icons.trending_up : Icons.trending_down,
                        color: growth >= 0 ? Colors.green : Colors.red,
                        size: 16,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${growth >= 0 ? '+' : ''}${growth.toStringAsFixed(1)}%',
                        style: TextStyle(
                          color: growth >= 0 ? Colors.green : Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Simple bar chart representation
            if (monthlyRevenue.isNotEmpty)
              SizedBox(
                height: 100,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: monthlyRevenue
                      .map((month) => _buildRevenueBar(context, month))
                      .toList(),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildRevenueBar(BuildContext context, Map<String, dynamic> month) {
    final amount = month['amount'] ?? 0;
    final label = month['label'] ?? '';
    final maxAmount = 10000; // This should be calculated from data
    final height = (amount / maxAmount * 80).clamp(10.0, 80.0);

    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Text(
          '\$${(amount / 1000).toStringAsFixed(0)}k',
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: 4),
        Container(
          width: 30,
          height: height,
          decoration: BoxDecoration(
            color: Theme.of(context).primaryColor,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    );
  }
}
