/// Admin Recent Activity Widget
import 'package:flutter/material.dart';
import '../../../core/utils/constants.dart';
import '../../../core/utils/utils.dart';

class AdminRecentActivity extends StatelessWidget {
  final Map<String, dynamic>? data;

  const AdminRecentActivity({Key? key, this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final activities = (data?['activities'] as List?) ?? [];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Recent Activity',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            if (activities.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text('No recent activity'),
                ),
              )
            else
              ...activities
                  .take(10)
                  .map((activity) => _buildActivityItem(context, activity))
                  .toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildActivityItem(
      BuildContext context, Map<String, dynamic> activity) {
    final type = activity['type'] ?? '';
    IconData icon;
    Color color;

    switch (type) {
      case 'user_registered':
        icon = Icons.person_add;
        color = Colors.green;
        break;
      case 'course_created':
        icon = Icons.add_box;
        color = Colors.blue;
        break;
      case 'enrollment':
        icon = Icons.assignment;
        color = Colors.orange;
        break;
      case 'payment':
        icon = Icons.payment;
        color = Colors.purple;
        break;
      default:
        icon = Icons.notifications;
        color = Colors.grey;
    }

    return ListTile(
      dense: true,
      contentPadding: EdgeInsets.zero,
      leading: CircleAvatar(
        backgroundColor: color.withOpacity(0.2),
        child: Icon(icon, color: color, size: 20),
      ),
      title: Text(
        activity['message'] ?? 'Activity',
        style: Theme.of(context).textTheme.bodyMedium,
        maxLines: 2,
        overflow: TextOverflow.ellipsis,
      ),
      subtitle: Text(
        Utils.formatDate(
          activity['timestamp'] != null
              ? DateTime.parse(activity['timestamp'])
              : DateTime.now(),
        ),
        style: Theme.of(context).textTheme.bodySmall,
      ),
    );
  }
}
