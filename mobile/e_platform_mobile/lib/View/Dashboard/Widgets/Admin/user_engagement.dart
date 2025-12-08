/// Admin User Engagement Widget
import 'package:flutter/material.dart';
import '../../../core/utils/constants.dart';

class AdminUserEngagement extends StatelessWidget {
  final Map<String, dynamic>? data;

  const AdminUserEngagement({Key? key, this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final activeUsers = data?['activeUsers'] ?? 0;
    final newUsers = data?['newUsers'] ?? 0;
    final engagementRate = (data?['engagementRate'] ?? 0.0).toDouble();
    final avgSessionTime = data?['avgSessionTime'] ?? '0m';

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'User Engagement',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            _buildEngagementRow(
              context,
              'Active Users',
              activeUsers.toString(),
              Icons.people,
              Colors.blue,
            ),
            const SizedBox(height: 12),
            _buildEngagementRow(
              context,
              'New Users (7d)',
              newUsers.toString(),
              Icons.person_add,
              Colors.green,
            ),
            const SizedBox(height: 12),
            _buildEngagementRow(
              context,
              'Engagement Rate',
              '${engagementRate.toStringAsFixed(1)}%',
              Icons.trending_up,
              Colors.orange,
            ),
            const SizedBox(height: 12),
            _buildEngagementRow(
              context,
              'Avg Session Time',
              avgSessionTime.toString(),
              Icons.access_time,
              Colors.purple,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEngagementRow(
    BuildContext context,
    String label,
    String value,
    IconData icon,
    Color color,
  ) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(width: 12),
            Text(
              label,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
        Text(
          value,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
      ],
    );
  }
}
