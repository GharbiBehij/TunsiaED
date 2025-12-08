/// Instructor Revenue Trends Widget
import 'package:flutter/material.dart';
import '../../../core/utils/constants.dart';

class InstructorRevenueTrends extends StatelessWidget {
  final Map<String, dynamic>? data;

  const InstructorRevenueTrends({Key? key, this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final thisMonth = data?['thisMonth'] ?? 0;
    final lastMonth = data?['lastMonth'] ?? 0;
    final growth = data?['growth'] ?? 0.0;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Revenue Trends',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            Text(
              '\$${thisMonth.toString()}',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
            ),
            Text(
              'This Month',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(
                  growth >= 0 ? Icons.trending_up : Icons.trending_down,
                  color: growth >= 0 ? Colors.green : Colors.red,
                  size: 20,
                ),
                const SizedBox(width: 4),
                Text(
                  '${growth >= 0 ? '+' : ''}${growth.toStringAsFixed(1)}%',
                  style: TextStyle(
                    color: growth >= 0 ? Colors.green : Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  'vs last month (\$${lastMonth})',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
