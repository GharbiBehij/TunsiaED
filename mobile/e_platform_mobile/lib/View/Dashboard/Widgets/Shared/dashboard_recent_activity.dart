/// Centralized Recent Activity Widget
/// Role-agnostic activity feed for dashboards
import 'package:flutter/material.dart';
import '../../../core/utils/constants.dart';
import '../../../core/utils/utils.dart';

/// Activity type configuration
class ActivityTypeConfig {
  final IconData icon;
  final Color color;

  const ActivityTypeConfig({
    required this.icon,
    required this.color,
  });
}

/// Role-based activity type configurations
class ActivityTypeRegistry {
  static final Map<String, Map<String, ActivityTypeConfig>> _configs = {
    'student': {
      'enrollment': ActivityTypeConfig(
        icon: Icons.school,
        color: Colors.green,
      ),
      'completion': ActivityTypeConfig(
        icon: Icons.check_circle,
        color: Colors.blue,
      ),
      'certificate': ActivityTypeConfig(
        icon: Icons.card_membership,
        color: Colors.purple,
      ),
      'quiz': ActivityTypeConfig(
        icon: Icons.quiz,
        color: Colors.orange,
      ),
      'default': ActivityTypeConfig(
        icon: Icons.notifications,
        color: Colors.grey,
      ),
    },
    'instructor': {
      'enrollment': ActivityTypeConfig(
        icon: Icons.person_add,
        color: Colors.green,
      ),
      'review': ActivityTypeConfig(
        icon: Icons.star,
        color: Colors.orange,
      ),
      'question': ActivityTypeConfig(
        icon: Icons.question_answer,
        color: Colors.blue,
      ),
      'payment': ActivityTypeConfig(
        icon: Icons.payment,
        color: Colors.purple,
      ),
      'default': ActivityTypeConfig(
        icon: Icons.notifications,
        color: Colors.grey,
      ),
    },
    'admin': {
      'user_registered': ActivityTypeConfig(
        icon: Icons.person_add,
        color: Colors.green,
      ),
      'course_created': ActivityTypeConfig(
        icon: Icons.add_box,
        color: Colors.blue,
      ),
      'enrollment': ActivityTypeConfig(
        icon: Icons.assignment,
        color: Colors.orange,
      ),
      'payment': ActivityTypeConfig(
        icon: Icons.payment,
        color: Colors.purple,
      ),
      'default': ActivityTypeConfig(
        icon: Icons.notifications,
        color: Colors.grey,
      ),
    },
  };

  static ActivityTypeConfig getConfig(String role, String type) {
    final roleConfig = _configs[role] ?? _configs['student']!;
    return roleConfig[type] ?? roleConfig['default']!;
  }
}

/// Centralized Recent Activity Widget
class DashboardRecentActivity extends StatelessWidget {
  final String role;
  final Map<String, dynamic>? data;
  final String title;
  final int maxItems;

  const DashboardRecentActivity({
    Key? key,
    required this.role,
    this.data,
    this.title = 'Recent Activity',
    this.maxItems = 10,
  }) : super(key: key);

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
              title,
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
                  .take(maxItems)
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
    final config = ActivityTypeRegistry.getConfig(role, type);

    return ListTile(
      dense: true,
      contentPadding: EdgeInsets.zero,
      leading: CircleAvatar(
        backgroundColor: config.color.withOpacity(0.2),
        child: Icon(config.icon, color: config.color, size: 20),
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
