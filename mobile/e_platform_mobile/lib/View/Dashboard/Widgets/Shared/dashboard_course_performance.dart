/// Centralized Course Performance Widget
/// Role-agnostic course performance metrics
import 'package:flutter/material.dart';
import '../../../core/utils/constants.dart';

/// Course performance display mode
enum PerformanceDisplayMode {
  topCourses, // Show top performing courses (admin)
  myCourses, // Show instructor's course performance
  enrolledCourses, // Show student's enrolled courses
}

/// Centralized Course Performance Widget
class DashboardCoursePerformance extends StatelessWidget {
  final String role;
  final Map<String, dynamic>? data;
  final String title;
  final int maxItems;

  const DashboardCoursePerformance({
    Key? key,
    required this.role,
    this.data,
    String? title,
    this.maxItems = 5,
  })  : title = title ?? _getDefaultTitle(role),
        super(key: key);

  static String _getDefaultTitle(String role) {
    switch (role) {
      case 'admin':
        return 'Top Performing Courses';
      case 'instructor':
        return 'Course Performance';
      case 'student':
        return 'My Course Progress';
      default:
        return 'Courses';
    }
  }

  @override
  Widget build(BuildContext context) {
    final courses = _getCoursesList();

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
            if (courses.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text('No course data available'),
                ),
              )
            else
              ...courses
                  .take(maxItems)
                  .map((course) => _buildCourseItem(context, course))
                  .toList(),
          ],
        ),
      ),
    );
  }

  List<dynamic> _getCoursesList() {
    // Try different data keys based on role
    return (data?['topCourses'] as List?) ??
        (data?['courses'] as List?) ??
        (data?['enrolledCourses'] as List?) ??
        [];
  }

  Widget _buildCourseItem(BuildContext context, Map<String, dynamic> course) {
    final title = course['title'] ?? 'Course';
    final enrollments = course['enrollments'] ?? 0;
    final completionRate = (course['completionRate'] ?? 0.0).toDouble();
    final avgRating = (course['avgRating'] ?? course['rating'] ?? 0.0).toDouble();
    final revenue = course['revenue'];

    return Padding(
      padding: const EdgeInsets.only(bottom: AppConstants.defaultPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius:
                      BorderRadius.circular(AppConstants.borderRadius),
                ),
                child: const Icon(Icons.play_circle_outline, size: 25),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        if (enrollments > 0) ...[
                          Icon(Icons.people, size: 14, color: Colors.grey[600]),
                          const SizedBox(width: 4),
                          Text(
                            '$enrollments',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          const SizedBox(width: 12),
                        ],
                        if (avgRating > 0) ...[
                          Icon(Icons.star, size: 14, color: Colors.orange),
                          const SizedBox(width: 4),
                          Text(
                            avgRating.toStringAsFixed(1),
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
              if (revenue != null)
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
              if (completionRate > 0 && revenue == null)
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
                      'Complete',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
            ],
          ),
          if (completionRate > 0) ...[
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: completionRate / 100,
              minHeight: 6,
              borderRadius: BorderRadius.circular(AppConstants.borderRadius),
            ),
          ],
          const Divider(height: 24),
        ],
      ),
    );
  }
}
