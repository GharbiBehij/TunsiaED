import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../ViewModel/Course/course_viewmodel.dart';
import '../../core/utils/constants.dart';
import '../../core/utils/utils.dart';
import '../Payment/payment_screen.dart';

/// Course Detail Screen
/// Displays detailed information about a course
class CourseDetailScreen extends StatefulWidget {
  final String courseId;

  const CourseDetailScreen({
    Key? key,
    required this.courseId,
  }) : super(key: key);

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  @override
  void initState() {
    super.initState();
    _loadCourseDetails();
  }

  Future<void> _loadCourseDetails() async {
    final courseViewModel =
        Provider.of<CourseViewModel>(context, listen: false);
    await courseViewModel.fetchCourseById(widget.courseId);
    await courseViewModel.fetchCourseContent(widget.courseId);
  }

  Future<void> _handleEnroll() async {
    final courseViewModel =
        Provider.of<CourseViewModel>(context, listen: false);
    final course = courseViewModel.currentCourse;

    if (course == null) return;

    final price = course['price']?.toDouble() ?? 0.0;

    // Navigate to payment screen
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => PaymentScreen(
          courseId: widget.courseId,
          courseTitle: course['title'] ?? 'Course',
          price: price,
        ),
      ),
    );

    // If payment successful, refresh course data
    if (result == true && mounted) {
      await courseViewModel.fetchCourseById(widget.courseId);
      if (mounted) {
        Utils.showMessage(context, 'Successfully enrolled in course!');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<CourseViewModel>(
        builder: (context, viewModel, _) {
          if (viewModel.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (viewModel.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(viewModel.error!),
                  ElevatedButton(
                    onPressed: _loadCourseDetails,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          final course = viewModel.selectedCourse;
          if (course == null) {
            return const Center(child: Text('Course not found'));
          }

          return CustomScrollView(
            slivers: [
              // App Bar with Course Image
              SliverAppBar(
                expandedHeight: 200,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  title: Text(
                    course['title'] ?? 'Course',
                    style: const TextStyle(
                      shadows: [
                        Shadow(
                          offset: Offset(0, 1),
                          blurRadius: 3,
                          color: Colors.black45,
                        ),
                      ],
                    ),
                  ),
                  background: Container(
                    color: Colors.grey[300],
                    child: const Icon(Icons.play_circle_outline, size: 80),
                  ),
                ),
              ),

              // Course Details
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(AppConstants.defaultPadding),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Instructor Info
                      Row(
                        children: [
                          CircleAvatar(
                            child: Text(
                              Utils.getInitials(
                                  course['instructor'] ?? 'Instructor'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  course['instructor'] ?? 'Unknown Instructor',
                                  style: Theme.of(context).textTheme.titleMedium,
                                ),
                                Text(
                                  'Instructor',
                                  style: Theme.of(context).textTheme.bodySmall,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppConstants.defaultPadding),

                      // Rating and Price
                      Row(
                        children: [
                          const Icon(Icons.star, color: Colors.orange),
                          const SizedBox(width: 4),
                          Text(
                            course['rating']?.toString() ?? 'N/A',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(width: 16),
                          Text(
                            '\$${course['price'] ?? '0'}',
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(
                                  color: Theme.of(context).primaryColor,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppConstants.largePadding),

                      // Description
                      Text(
                        'About this course',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        course['description'] ?? 'No description available',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const SizedBox(height: AppConstants.largePadding),

                      // Course Content
                      Text(
                        'Course Content',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 8),
                      _buildCourseContent(viewModel.courseContent),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
      bottomNavigationBar: Consumer<CourseViewModel>(
        builder: (context, viewModel, _) {
          return SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(AppConstants.defaultPadding),
              child: ElevatedButton(
                onPressed: viewModel.isLoading ? null : _handleEnroll,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: viewModel.isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Enroll Now'),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildCourseContent(Map<String, dynamic>? content) {
    if (content == null || content.isEmpty) {
      return const Text('No content available');
    }

    return Column(
      children: [
        ListTile(
          leading: const Icon(Icons.video_library),
          title: Text('${content['totalLessons'] ?? 0} Lessons'),
        ),
        ListTile(
          leading: const Icon(Icons.access_time),
          title: Text('${content['duration'] ?? 0} Hours'),
        ),
        ListTile(
          leading: const Icon(Icons.book),
          title: Text('${content['chapters'] ?? 0} Chapters'),
        ),
      ],
    );
  }
}
