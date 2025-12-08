/// Instructor Stats Cards Widget
import 'package:flutter/material.dart';
import '../Shared/stat_card.dart';
import '../../../core/utils/constants.dart';

class InstructorStatsCards extends StatelessWidget {
  final Map<String, dynamic>? data;

  const InstructorStatsCards({Key? key, this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final totalCourses = data?['totalCourses'] ?? 0;
    final totalStudents = data?['totalStudents'] ?? 0;
    final totalEarnings = data?['totalEarnings'] ?? 0;
    final avgRating = data?['avgRating'] ?? 0.0;

    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: AppConstants.defaultPadding,
      mainAxisSpacing: AppConstants.defaultPadding,
      childAspectRatio: 1.5,
      children: [
        StatCard(
          title: 'Total Courses',
          value: totalCourses.toString(),
          icon: Icons.video_library,
          color: Colors.blue,
        ),
        StatCard(
          title: 'Total Students',
          value: totalStudents.toString(),
          icon: Icons.people,
          color: Colors.green,
        ),
        StatCard(
          title: 'Total Earnings',
          value: '\$${totalEarnings.toString()}',
          icon: Icons.attach_money,
          color: Colors.purple,
        ),
        StatCard(
          title: 'Avg Rating',
          value: avgRating.toString(),
          icon: Icons.star,
          color: Colors.orange,
        ),
      ],
    );
  }
}
