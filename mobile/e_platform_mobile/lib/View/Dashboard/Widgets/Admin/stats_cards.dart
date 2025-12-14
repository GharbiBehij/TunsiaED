/// Admin Stats Cards Widget
import 'package:flutter/material.dart';
import '../Shared/stat_card.dart';
import '../../../core/utils/constants.dart';

class AdminStatsCards extends StatelessWidget {
  final Map<String, dynamic>? data;

  const AdminStatsCards({Key? key, this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final totalUsers = data?['totalUsers'] ?? 0;
    final totalCourses = data?['totalCourses'] ?? 0;
    final activeEnrollments = data?['activeEnrollments'] ?? 0;
    final totalRevenue = data?['totalRevenue'] ?? 0;

    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: AppConstants.defaultPadding,
      mainAxisSpacing: AppConstants.defaultPadding,
      childAspectRatio: 1.5,
      children: [
        StatCard(
          title: 'Total Users',
          value: totalUsers.toString(),
          icon: Icons.people,
          color: Colors.blue,
        ),
        StatCard(
          title: 'Total Courses',
          value: totalCourses.toString(),
          icon: Icons.school,
          color: Colors.green,
        ),
        StatCard(
          title: 'Active Enrollments',
          value: activeEnrollments.toString(),
          icon: Icons.assignment,
          color: Colors.orange,
        ),
        StatCard(
          title: 'Total Revenue',
          value: '\$${totalRevenue.toString()}',
          icon: Icons.attach_money,
          color: Colors.purple,
        ),
      ],
    );
  }
}
