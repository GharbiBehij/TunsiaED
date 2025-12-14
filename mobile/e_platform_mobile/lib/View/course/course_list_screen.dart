import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../ViewModel/Course/course_viewmodel.dart';
import '../../core/utils/constants.dart';
import 'course_detail_screen.dart';

/// Course List Screen
/// Displays all available courses
class CourseListScreen extends StatefulWidget {
  const CourseListScreen({Key? key}) : super(key: key);

  @override
  State<CourseListScreen> createState() => _CourseListScreenState();
}

class _CourseListScreenState extends State<CourseListScreen> {
  final _searchController = TextEditingController();
  String? _selectedCategory;

  @override
  void initState() {
    super.initState();
    _loadCourses();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadCourses() async {
    final courseViewModel =
        Provider.of<CourseViewModel>(context, listen: false);
    await courseViewModel.fetchCourses(
      search: _searchController.text.isEmpty ? null : _searchController.text,
      category: _selectedCategory,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Browse Courses'),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(AppConstants.defaultPadding),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search courses...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppConstants.borderRadius),
                ),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          _loadCourses();
                        },
                      )
                    : null,
              ),
              onSubmitted: (_) => _loadCourses(),
            ),
          ),

          // Course List
          Expanded(
            child: Consumer<CourseViewModel>(
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
                          onPressed: _loadCourses,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  );
                }

                if (viewModel.courses.isEmpty) {
                  return const Center(
                    child: Text('No courses found'),
                  );
                }

                return RefreshIndicator(
                  onRefresh: _loadCourses,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(AppConstants.defaultPadding),
                    itemCount: viewModel.courses.length,
                    itemBuilder: (context, index) {
                      final course = viewModel.courses[index];
                      return _buildCourseCard(course);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCourseCard(Map<String, dynamic> course) {
    // Extract courseId with fallback (web compatibility)
    final courseId = course['courseId'] ?? course['id'];
    
    return Card(
      margin: const EdgeInsets.only(bottom: AppConstants.defaultPadding),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => CourseDetailScreen(courseId: courseId),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(AppConstants.defaultPadding),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Course Thumbnail
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(AppConstants.borderRadius),
                ),
                child: const Icon(Icons.play_circle_outline, size: 48),
              ),
              const SizedBox(width: AppConstants.defaultPadding),

              // Course Details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      course['title'] ?? 'Untitled Course',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      course['instructor'] ?? 'Unknown Instructor',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(Icons.star, size: 16, color: Colors.orange),
                        const SizedBox(width: 4),
                        Text(
                          course['rating']?.toString() ?? 'N/A',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        const SizedBox(width: 16),
                        Text(
                          '\$${course['price'] ?? '0'}',
                          style:
                              Theme.of(context).textTheme.titleMedium?.copyWith(
                                    color: Theme.of(context).primaryColor,
                                    fontWeight: FontWeight.bold,
                                  ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
