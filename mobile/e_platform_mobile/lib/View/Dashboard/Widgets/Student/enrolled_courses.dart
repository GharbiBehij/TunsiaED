/// Student Enrolled Courses Widget
import 'package:flutter/material.dart';
import '../../../core/utils/constants.dart';
import '../../../core/utils/utils.dart';

class StudentEnrolledCourses extends StatelessWidget {
  final Map<String, dynamic>? data;

  const StudentEnrolledCourses({Key? key, this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final courses = (data?['courses'] as List?) ?? [];

    if (courses.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(AppConstants.largePadding),
          child: Center(
            child: Column(
              children: [
                Icon(Icons.school, size: 64, color: Colors.grey[400]),
                const SizedBox(height: 16),
                Text(
                  'No enrolled courses yet',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                const Text('Start learning by enrolling in a course'),
              ],
            ),
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'My Courses',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 16),
        ...courses.map((course) => _buildCourseCard(context, course)).toList(),
      ],
    );
  }

  Widget _buildCourseCard(BuildContext context, Map<String, dynamic> course) {
    final progress = (course['progress'] ?? 0.0).toDouble();

    return Card(
      margin: const EdgeInsets.only(bottom: AppConstants.defaultPadding),
      child: InkWell(
        onTap: () {
          // Navigate to course detail
        },
        child: Padding(
          padding: const EdgeInsets.all(AppConstants.defaultPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius:
                          BorderRadius.circular(AppConstants.borderRadius),
                    ),
                    child: const Icon(Icons.play_circle_outline, size: 40),
                  ),
                  const SizedBox(width: AppConstants.defaultPadding),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          course['title'] ?? 'Course',
                          style:
                              Theme.of(context).textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          course['instructor'] ?? 'Instructor',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              LinearProgressIndicator(
                value: progress / 100,
                minHeight: 6,
                borderRadius: BorderRadius.circular(AppConstants.borderRadius),
              ),
              const SizedBox(height: 4),
              Text(
                '${progress.toStringAsFixed(0)}% Complete',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
