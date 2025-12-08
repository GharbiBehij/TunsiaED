/// Student Progress Summary Widget
import 'package:flutter/material.dart';
import '../../../core/utils/constants.dart';
import '../../../core/utils/utils.dart';

class StudentProgressSummary extends StatelessWidget {
  final Map<String, dynamic>? data;

  const StudentProgressSummary({Key? key, this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (data == null) {
      return const SizedBox.shrink();
    }

    final completedLessons = data?['completedLessons'] ?? 0;
    final totalLessons = data?['totalLessons'] ?? 0;
    final completedCourses = data?['completedCourses'] ?? 0;
    final inProgressCourses = data?['inProgressCourses'] ?? 0;

    final overallProgress = totalLessons > 0
        ? Utils.calculateProgress(completedLessons, totalLessons)
        : 0.0;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Overall Progress',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            LinearProgressIndicator(
              value: overallProgress / 100,
              minHeight: 10,
              borderRadius: BorderRadius.circular(AppConstants.borderRadius),
            ),
            const SizedBox(height: 8),
            Text(
              '${overallProgress.toStringAsFixed(0)}% Complete',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildProgressStat(
                    context, 'Completed', completedCourses, Colors.green),
                _buildProgressStat(
                    context, 'In Progress', inProgressCourses, Colors.orange),
                _buildProgressStat(
                    context, 'Lessons', completedLessons, Colors.blue),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressStat(
      BuildContext context, String label, int value, Color color) {
    return Column(
      children: [
        Text(
          value.toString(),
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    );
  }
}
