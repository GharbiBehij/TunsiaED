/// Instructor My Courses Widget
import 'package:flutter/material.dart';
import '../../../core/utils/constants.dart';

class InstructorMyCourses extends StatelessWidget {
  final Map<String, dynamic>? data;

  const InstructorMyCourses({Key? key, this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final courses = (data?['courses'] as List?) ?? [];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'My Courses',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            TextButton.icon(
              onPressed: () {
                // Navigate to create course
              },
              icon: const Icon(Icons.add),
              label: const Text('Create'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        if (courses.isEmpty)
          Card(
            child: Padding(
              padding: const EdgeInsets.all(AppConstants.largePadding),
              child: Center(
                child: Column(
                  children: [
                    Icon(Icons.video_library, size: 64, color: Colors.grey[400]),
                    const SizedBox(height: 16),
                    const Text('No courses yet'),
                    const SizedBox(height: 8),
                    ElevatedButton.icon(
                      onPressed: () {
                        // Navigate to create course
                      },
                      icon: const Icon(Icons.add),
                      label: const Text('Create Your First Course'),
                    ),
                  ],
                ),
              ),
            ),
          )
        else
          ...courses.take(5).map((course) => _buildCourseCard(context, course)).toList(),
      ],
    );
  }

  Widget _buildCourseCard(BuildContext context, Map<String, dynamic> course) {
    final enrollments = course['enrollments'] ?? 0;
    final avgRating = (course['avgRating'] ?? 0.0).toDouble();

    return Card(
      margin: const EdgeInsets.only(bottom: AppConstants.defaultPadding),
      child: InkWell(
        onTap: () {
          // Navigate to course management
        },
        child: Padding(
          padding: const EdgeInsets.all(AppConstants.defaultPadding),
          child: Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(AppConstants.borderRadius),
                ),
                child: const Icon(Icons.play_circle_outline, size: 30),
              ),
              const SizedBox(width: AppConstants.defaultPadding),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      course['title'] ?? 'Course',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(Icons.people, size: 16, color: Colors.grey[600]),
                        const SizedBox(width: 4),
                        Text(
                          '$enrollments students',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        const SizedBox(width: 16),
                        Icon(Icons.star, size: 16, color: Colors.orange),
                        const SizedBox(width: 4),
                        Text(
                          avgRating.toStringAsFixed(1),
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Icon(Icons.chevron_right, color: Colors.grey[400]),
            ],
          ),
        ),
      ),
    );
  }
}
