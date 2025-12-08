/// Student Stats Cards Widget
import 'package:flutter/material.dart';
import '../Shared/stat_card.dart';
import '../../../core/utils/constants.dart';

class StudentStatsCards extends StatelessWidget {
  final Map<String, dynamic>? data;

  const StudentStatsCards({Key? key, this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final enrolledCourses = data?['enrolledCourses'] ?? 0;
    final completedCourses = data?['completedCourses'] ?? 0;
    final inProgressCourses = data?['inProgressCourses'] ?? 0;
    final certificates = data?['certificates'] ?? 0;

    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: AppConstants.defaultPadding,
      mainAxisSpacing: AppConstants.defaultPadding,
      childAspectRatio: 1.5,
      children: [
        StatCard(
          title: 'Enrolled Courses',
          value: enrolledCourses.toString(),
          icon: Icons.school,
          color: Colors.blue,
        ),
        StatCard(
          title: 'Completed',
          value: completedCourses.toString(),
          icon: Icons.check_circle,
          color: Colors.green,
        ),
        StatCard(
          title: 'In Progress',
          value: inProgressCourses.toString(),
          icon: Icons.pending,
          color: Colors.orange,
        ),
        StatCard(
          title: 'Certificates',
          value: certificates.toString(),
          icon: Icons.card_membership,
          color: Colors.purple,
        ),
      ],
    );
  }
}
