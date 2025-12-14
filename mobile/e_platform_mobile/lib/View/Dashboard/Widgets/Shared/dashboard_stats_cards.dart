/// Centralized Stats Cards Widget
/// Role-agnostic dashboard statistics cards
import 'package:flutter/material.dart';
import '../../../core/utils/constants.dart';
import 'stat_card.dart';

/// Configuration for a single stat card
class StatCardConfig {
  final String key;
  final String title;
  final IconData icon;
  final Color color;
  final String Function(dynamic value)? formatter;

  const StatCardConfig({
    required this.key,
    required this.title,
    required this.icon,
    required this.color,
    this.formatter,
  });
}

/// Role-based stat configurations
class DashboardStatsConfig {
  static final Map<String, List<StatCardConfig>> _configs = {
    'student': [
      StatCardConfig(
        key: 'enrolledCourses',
        title: 'Enrolled Courses',
        icon: Icons.school,
        color: Colors.blue,
      ),
      StatCardConfig(
        key: 'completedCourses',
        title: 'Completed',
        icon: Icons.check_circle,
        color: Colors.green,
      ),
      StatCardConfig(
        key: 'inProgressCourses',
        title: 'In Progress',
        icon: Icons.pending,
        color: Colors.orange,
      ),
      StatCardConfig(
        key: 'certificates',
        title: 'Certificates',
        icon: Icons.card_membership,
        color: Colors.purple,
      ),
    ],
    'instructor': [
      StatCardConfig(
        key: 'totalCourses',
        title: 'Total Courses',
        icon: Icons.video_library,
        color: Colors.blue,
      ),
      StatCardConfig(
        key: 'totalStudents',
        title: 'Total Students',
        icon: Icons.people,
        color: Colors.green,
      ),
      StatCardConfig(
        key: 'totalEarnings',
        title: 'Total Earnings',
        icon: Icons.attach_money,
        color: Colors.purple,
        formatter: (value) => '\$$value',
      ),
      StatCardConfig(
        key: 'avgRating',
        title: 'Avg Rating',
        icon: Icons.star,
        color: Colors.orange,
      ),
    ],
    'admin': [
      StatCardConfig(
        key: 'totalUsers',
        title: 'Total Users',
        icon: Icons.people,
        color: Colors.blue,
      ),
      StatCardConfig(
        key: 'totalCourses',
        title: 'Total Courses',
        icon: Icons.school,
        color: Colors.green,
      ),
      StatCardConfig(
        key: 'activeEnrollments',
        title: 'Active Enrollments',
        icon: Icons.assignment,
        color: Colors.orange,
      ),
      StatCardConfig(
        key: 'totalRevenue',
        title: 'Total Revenue',
        icon: Icons.attach_money,
        color: Colors.purple,
        formatter: (value) => '\$$value',
      ),
    ],
  };

  static List<StatCardConfig> getConfig(String role) {
    return _configs[role] ?? _configs['student']!;
  }
}

/// Centralized Stats Cards Widget
class DashboardStatsCards extends StatelessWidget {
  final String role;
  final Map<String, dynamic>? data;
  final int crossAxisCount;
  final double childAspectRatio;

  const DashboardStatsCards({
    Key? key,
    required this.role,
    this.data,
    this.crossAxisCount = 2,
    this.childAspectRatio = 1.5,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final config = DashboardStatsConfig.getConfig(role);

    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: crossAxisCount,
      crossAxisSpacing: AppConstants.defaultPadding,
      mainAxisSpacing: AppConstants.defaultPadding,
      childAspectRatio: childAspectRatio,
      children: config.map((statConfig) {
        final value = data?[statConfig.key] ?? 0;
        final displayValue = statConfig.formatter != null
            ? statConfig.formatter!(value)
            : value.toString();

        return StatCard(
          title: statConfig.title,
          value: displayValue,
          icon: statConfig.icon,
          color: statConfig.color,
        );
      }).toList(),
    );
  }
}
