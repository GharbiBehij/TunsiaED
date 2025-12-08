/// Instructor Course Performance Widget
import 'package:flutter/material.dart';
import '../../../core/utils/constants.dart';

class InstructorCoursePerformance extends StatelessWidget {
  final Map<String, dynamic>? data;

  const InstructorCoursePerformance({Key? key, this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final courses = (data?['courses'] as List?) ?? [];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Course Performance',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            if (courses.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text('No performance data available'),
                ),
              )
            else
              ...courses
                  .take(5)
                  .map((course) => _buildPerformanceItem(context, course))
                  .toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildPerformanceItem(
      BuildContext context, Map<String, dynamic> course) {
    final enrollments = course['enrollments'] ?? 0;
    final completionRate = (course['completionRate'] ?? 0.0).toDouble();
    final avgRating = (course['avgRating'] ?? 0.0).toDouble();

    return Padding(
      padding: const EdgeInsets.only(bottom: AppConstants.defaultPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            course['title'] ?? 'Course',
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Enrollments: $enrollments',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Rating: ${avgRating.toStringAsFixed(1)} ⭐',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '${completionRate.toStringAsFixed(0)}%',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                  ),
                  Text(
                    'Completion',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: completionRate / 100,
            minHeight: 6,
            borderRadius: BorderRadius.circular(AppConstants.borderRadius),
          ),
          const Divider(height: 24),
        ],
      ),
    );
  }
}
