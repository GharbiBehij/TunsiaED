import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../ViewModel/Student/student_viewmodel.dart';
import '../../core/utils/constants.dart';
import '../../core/utils/utils.dart';

/// Progress Screen
/// Shows student's learning progress
class ProgressScreen extends StatefulWidget {
  const ProgressScreen({Key? key}) : super(key: key);

  @override
  State<ProgressScreen> createState() => _ProgressScreenState();
}

class _ProgressScreenState extends State<ProgressScreen> {
  @override
  void initState() {
    super.initState();
    _loadProgress();
  }

  Future<void> _loadProgress() async {
    final studentViewModel =
        Provider.of<StudentViewModel>(context, listen: false);
    await studentViewModel.fetchProgress();
    await studentViewModel.fetchEnrolledCourses();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Progress'),
      ),
      body: Consumer<StudentViewModel>(
        builder: (context, viewModel, _) {
          if (viewModel.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (viewModel.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline, size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  Text(viewModel.error!),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _loadProgress,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          final enrolledCourses = viewModel.enrolledCourses;
          if (enrolledCourses.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.school_outlined,
                      size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  const Text('No courses enrolled yet'),
                  const SizedBox(height: 8),
                  const Text('Start learning to see your progress'),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _loadProgress,
            child: ListView(
              padding: const EdgeInsets.all(AppConstants.defaultPadding),
              children: [
                // Overall Progress Card
                Card(
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
                        _buildOverallStats(viewModel.progress),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: AppConstants.defaultPadding),

                // Course Progress List
                Text(
                  'Course Progress',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: AppConstants.defaultPadding),

                ...enrolledCourses.map((course) => _buildCourseProgressCard(course)),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildOverallStats(Map<String, dynamic>? progress) {
    final completedCourses = progress?['completedCourses'] ?? 0;
    final inProgressCourses = progress?['inProgressCourses'] ?? 0;
    final totalLessons = progress?['totalLessons'] ?? 0;
    final completedLessons = progress?['completedLessons'] ?? 0;
    final overallProgress = totalLessons > 0
        ? Utils.calculateProgress(completedLessons, totalLessons)
        : 0.0;

    return Column(
      children: [
        // Overall Progress Bar
        Row(
          children: [
            Expanded(
              child: LinearProgressIndicator(
                value: overallProgress / 100,
                minHeight: 8,
                borderRadius:
                    BorderRadius.circular(AppConstants.borderRadius),
              ),
            ),
            const SizedBox(width: 12),
            Text(
              '${overallProgress.toStringAsFixed(0)}%',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Stats Grid
        Row(
          children: [
            Expanded(
              child: _buildStatItem(
                'Completed',
                completedCourses.toString(),
                Colors.green,
              ),
            ),
            Expanded(
              child: _buildStatItem(
                'In Progress',
                inProgressCourses.toString(),
                Colors.orange,
              ),
            ),
            Expanded(
              child: _buildStatItem(
                'Lessons Done',
                '$completedLessons/$totalLessons',
                Colors.blue,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatItem(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(fontSize: 12),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildCourseProgressCard(Map<String, dynamic> course) {
    final progress = course['progress'] ?? 0.0;
    final completedLessons = course['completedLessons'] ?? 0;
    final totalLessons = course['totalLessons'] ?? 0;

    return Card(
      margin: const EdgeInsets.only(bottom: AppConstants.defaultPadding),
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              course['title'] ?? 'Course',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),

            // Progress Bar
            Row(
              children: [
                Expanded(
                  child: LinearProgressIndicator(
                    value: progress / 100,
                    minHeight: 6,
                    borderRadius:
                        BorderRadius.circular(AppConstants.borderRadius),
                  ),
                ),
                const SizedBox(width: 12),
                Text('${progress.toStringAsFixed(0)}%'),
              ],
            ),
            const SizedBox(height: 8),

            // Details
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '$completedLessons of $totalLessons lessons completed',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                TextButton(
                  onPressed: () {
                    // TODO: Navigate to course detail
                  },
                  child: const Text('Continue'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
