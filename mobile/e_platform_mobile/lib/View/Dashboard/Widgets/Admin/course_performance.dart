/// Admin Course Performance Widget
import 'package:flutter/material.dart';
import '../../../core/utils/constants.dart';

class AdminCoursePerformance extends StatelessWidget {
  final Map<String, dynamic>? data;

  const AdminCoursePerformance({Key? key, this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final courses = (data?['topCourses'] as List?) ?? [];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Top Performing Courses',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            if (courses.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text('No course data available'),
                ),
              )
            else
              ...courses
                  .take(5)
                  .map((course) => _buildCourseItem(context, course))
                  .toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildCourseItem(BuildContext context, Map<String, dynamic> course) {
    final enrollments = course['enrollments'] ?? 0;
    final revenue = course['revenue'] ?? 0;
    final rating = (course['rating'] ?? 0.0).toDouble();

    return Padding(
      padding: const EdgeInsets.only(bottom: AppConstants.defaultPadding),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(AppConstants.borderRadius),
            ),
            child: const Icon(Icons.play_circle_outline, size: 25),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  course['title'] ?? 'Course',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.people, size: 14, color: Colors.grey[600]),
                    const SizedBox(width: 4),
                    Text(
                      '$enrollments',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(width: 12),
                    Icon(Icons.star, size: 14, color: Colors.orange),
                    const SizedBox(width: 4),
                    Text(
                      rating.toStringAsFixed(1),
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '\$${revenue.toString()}',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.green,
                    ),
              ),
              Text(
                'Revenue',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
