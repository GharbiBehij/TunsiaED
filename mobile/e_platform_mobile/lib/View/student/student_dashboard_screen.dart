import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../ViewModel/Auth/auth_viewmodel.dart';
import '../../ViewModel/Student/student_viewmodel.dart';
import '../../core/utils/constants.dart';
import '../../core/utils/utils.dart';
import '../Auth/login_screen.dart';
import '../Dashboard/dynamic_dashboard.dart';
import '../payment/payment_history_screen.dart';
import '../subscription/subscription_plans_screen.dart';

class StudentDashboardScreen extends StatefulWidget {
  const StudentDashboardScreen({Key? key}) : super(key: key);

  @override
  State<StudentDashboardScreen> createState() => _StudentDashboardScreenState();
}

class _StudentDashboardScreenState extends State<StudentDashboardScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  bool _initializing = true;
  String? _lastError;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData(initial: true);
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData({bool forceRefresh = false, bool initial = false}) async {
    final viewModel = context.read<StudentViewModel>();

    if (initial) {
      setState(() {
        _initializing = true;
        _lastError = null;
      });
    }

    try {
      await Future.wait([
        viewModel.fetchDashboard(),
        viewModel.fetchEnrollmentsWithProgress(forceRefresh: forceRefresh),
        viewModel.fetchLearningOverview(forceRefresh: forceRefresh),
        viewModel.fetchProgressOverview(forceRefresh: forceRefresh),
        viewModel.fetchEnrolledCourses(),
        viewModel.fetchProgress(),
        viewModel.fetchCertificates(),
      ]);

      if (!mounted) return;

      setState(() {
        _lastError = viewModel.error;
      });

      if (viewModel.error != null) {
        Utils.showMessage(context, viewModel.error!, isError: true);
      }
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _lastError = error.toString();
      });
      Utils.showMessage(context, 'Failed to load dashboard data', isError: true);
    } finally {
      if (!mounted) return;
      setState(() {
        _initializing = false;
      });
    }
  }

  void _handleMenuSelection(String value) {
    switch (value) {
      case 'payment_history':
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => const PaymentHistoryScreen(),
          ),
        );
        break;
      case 'subscriptions':
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => const SubscriptionPlansScreen(),
          ),
        );
        break;
      case 'logout':
        _handleSignOut();
        break;
    }
  }

  Future<void> _handleSignOut() async {
    final authViewModel = context.read<AuthViewModel>();
    await authViewModel.signOut();

    if (!mounted) {
      return;
    }

    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<StudentViewModel>(
      builder: (context, viewModel, _) {
        final bool showInitialLoader = _initializing &&
            viewModel.dashboard == null &&
            viewModel.enrollmentsDetailed.isEmpty &&
            viewModel.learningOverview == null;

        return Scaffold(
          appBar: AppBar(
            title: const Text('Student Dashboard'),
            actions: [
              IconButton(
                icon: const Icon(Icons.refresh),
                onPressed: () => _loadData(forceRefresh: true),
                tooltip: 'Refresh',
              ),
              PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert),
                onSelected: _handleMenuSelection,
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'payment_history',
                    child: Row(
                      children: [
                        Icon(Icons.receipt_long),
                        SizedBox(width: 12),
                        Text('Payment History'),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'subscriptions',
                    child: Row(
                      children: [
                        Icon(Icons.card_membership),
                        SizedBox(width: 12),
                        Text('Subscription Plans'),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'logout',
                    child: Row(
                      children: [
                        Icon(Icons.logout),
                        SizedBox(width: 12),
                        Text('Sign Out'),
                      ],
                    ),
                  ),
                ],
              ),
            ],
            bottom: TabBar(
              controller: _tabController,
              isScrollable: true,
              tabs: const [
                Tab(text: 'Overview'),
                Tab(text: 'Courses'),
                Tab(text: 'Progress'),
                Tab(text: 'Certificates'),
              ],
            ),
          ),
          body: Stack(
            children: [
              if (showInitialLoader)
                const Center(child: CircularProgressIndicator())
              else
                TabBarView(
                  controller: _tabController,
                  children: [
                    _buildOverviewTab(viewModel),
                    _buildCoursesTab(viewModel),
                    _buildProgressTab(viewModel),
                    _buildCertificatesTab(viewModel),
                  ],
                ),
              if (viewModel.isLoading && !showInitialLoader)
                const Positioned(
                  left: 0,
                  right: 0,
                  top: 0,
                  child: LinearProgressIndicator(minHeight: 2),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildOverviewTab(StudentViewModel viewModel) {
    return RefreshIndicator(
      onRefresh: () => _loadData(forceRefresh: true),
      child: DynamicDashboard(
        role: AppConstants.roleStudent,
        dashboardData: viewModel.dashboard,
        isLoading: viewModel.isLoading && viewModel.dashboard == null,
        error: _lastError ?? viewModel.error,
        onRetry: () => _loadData(forceRefresh: true),
      ),
    );
  }

  Widget _buildCoursesTab(StudentViewModel viewModel) {
    final courses = viewModel.enrollmentsDetailed.isNotEmpty
        ? viewModel.enrollmentsDetailed
        : viewModel.enrolledCourses;

    if (courses.isEmpty) {
      return _buildRefreshablePlaceholder(
        _buildEmptyState(
          icon: Icons.menu_book_outlined,
          title: 'No enrollments yet',
          message: 'Enroll in a course to start learning.',
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => _loadData(forceRefresh: true),
      child: ListView.separated(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        itemCount: courses.length,
        separatorBuilder: (_, __) =>
            const SizedBox(height: AppConstants.defaultPadding),
        itemBuilder: (context, index) {
          final enrollment = Map<String, dynamic>.from(courses[index]);
          return _buildEnrollmentCard(enrollment);
        },
      ),
    );
  }

  Widget _buildProgressTab(StudentViewModel viewModel) {
    final overview =
        (viewModel.progressOverview ?? const <String, dynamic>{});
    final learning =
        (viewModel.learningOverview ?? const <String, dynamic>{});
    final recent = ((learning['recentProgress'] as List?) ?? const [])
        .whereType<Map>()
        .map((item) => Map<String, dynamic>.from(item))
        .toList();

    final hasContent = overview.isNotEmpty ||
        learning.isNotEmpty ||
        viewModel.enrollmentsDetailed.isNotEmpty ||
        recent.isNotEmpty;

    if (!hasContent) {
      return _buildRefreshablePlaceholder(
        _buildEmptyState(
          icon: Icons.trending_up,
          title: 'No progress yet',
          message: 'Progress will appear here once you start learning.',
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => _loadData(forceRefresh: true),
      child: ListView(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        children: [
          if (overview.isNotEmpty) _buildProgressSummaryCard(overview),
          if (learning.isNotEmpty) ...[
            const SizedBox(height: AppConstants.defaultPadding),
            _buildLearningHighlightsCard(learning),
          ],
          if (recent.isNotEmpty) ...[
            const SizedBox(height: AppConstants.defaultPadding),
            _buildRecentProgressSection(recent),
          ],
          if (viewModel.enrollmentsDetailed.isNotEmpty) ...[
            const SizedBox(height: AppConstants.defaultPadding),
            Text(
              'Active Courses',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 12),
            ...viewModel.enrollmentsDetailed
                .map((course) => _buildCourseProgressTile(
                    Map<String, dynamic>.from(course)))
                .toList(),
          ],
        ],
      ),
    );
  }

  Widget _buildCertificatesTab(StudentViewModel viewModel) {
    final certificates = viewModel.certificates;

    if (certificates.isEmpty) {
      return _buildRefreshablePlaceholder(
        _buildEmptyState(
          icon: Icons.card_membership_outlined,
          title: 'No certificates yet',
          message: 'Finish a course to earn your first certificate.',
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => _loadData(forceRefresh: true),
      child: GridView.builder(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: AppConstants.defaultPadding,
          mainAxisSpacing: AppConstants.defaultPadding,
          childAspectRatio: 0.8,
        ),
        itemCount: certificates.length,
        itemBuilder: (context, index) {
          final certificate =
              Map<String, dynamic>.from(certificates[index]);
          return _buildCertificateCard(certificate);
        },
      ),
    );
  }

  Widget _buildEnrollmentCard(Map<String, dynamic> enrollment) {
    final course = (enrollment['course'] as Map?)?.cast<String, dynamic>() ?? {};
    final courseTitle =
        enrollment['courseTitle'] ?? course['title'] ?? 'Course';
    final instructor =
        enrollment['instructorName'] ?? course['instructorName'] ?? '';
    final status = (enrollment['status'] ?? '').toString();
    final progressDetails =
        (enrollment['progressDetails'] as Map?)?.cast<String, dynamic>() ?? {};
    final progressValue = _readNum(
      enrollment['progress'] ??
          progressDetails['progress'] ??
          progressDetails['percentage'],
    );
    final completedLessons =
        progressDetails['completedLessons'] ?? enrollment['completedLessons'];
    final totalLessons =
        progressDetails['totalLessons'] ?? enrollment['totalLessons'];
    final lastAccessed = _parseDate(
      enrollment['lastAccessedAt'] ?? progressDetails['lastAccessedAt'],
    );
    final normalizedProgress = (progressValue.clamp(0, 100)) / 100;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    courseTitle.toString(),
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                if (status.isNotEmpty)
                  Chip(
                    label: Text(status.toUpperCase()),
                    backgroundColor: Colors.blueGrey.withOpacity(0.1),
                  ),
              ],
            ),
            if (instructor.toString().isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                instructor.toString(),
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
            const SizedBox(height: 12),
            LinearProgressIndicator(
              value: normalizedProgress,
              minHeight: 8,
              borderRadius: BorderRadius.circular(AppConstants.borderRadius),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('${progressValue.toStringAsFixed(0)}% complete'),
                if (completedLessons != null && totalLessons != null)
                  Text('$completedLessons / $totalLessons lessons'),
              ],
            ),
            if (lastAccessed != null) ...[
              const SizedBox(height: 6),
              Text(
                'Last accessed ${Utils.formatDate(lastAccessed)}',
                style: Theme.of(context)
                    .textTheme
                    .bodySmall
                    ?.copyWith(color: Colors.grey[600]),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildProgressSummaryCard(Map<String, dynamic> overview) {
    final summary =
        (overview['summary'] as Map?)?.cast<String, dynamic>() ?? overview;

    final metrics = <_ProgressMetric>[
      _ProgressMetric(
        label: 'Total Courses',
        value: summary['totalCourses'],
        color: Colors.blue,
      ),
      _ProgressMetric(
        label: 'Completed',
        value: summary['completedCourses'] ?? summary['completed'],
        color: Colors.green,
      ),
      _ProgressMetric(
        label: 'In Progress',
        value: summary['inProgressCourses'] ?? summary['inProgress'],
        color: Colors.orange,
      ),
      _ProgressMetric(
        label: 'Average Progress',
        value: summary['averageProgress'],
        color: Colors.purple,
        suffix: '%',
      ),
      _ProgressMetric(
        label: 'Certificates',
        value: summary['certificatesEarned'] ?? summary['certificates'],
        color: Colors.teal,
      ),
    ].where((metric) => metric.value != null).toList();

    if (metrics.isEmpty) {
      return const SizedBox.shrink();
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Progress Overview',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: AppConstants.defaultPadding,
              runSpacing: AppConstants.defaultPadding,
              children: metrics.map((metric) => metric.build(context)).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLearningHighlightsCard(Map<String, dynamic> learning) {
    final rows = <Widget>[];

    void addRow(String label, dynamic value, {String? Function(dynamic value)? formatter}) {
      if (value == null) return;
      final formatted = formatter != null ? formatter(value) : value.toString();
      if (formatted == null || formatted.isEmpty) return;
      rows.add(
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label),
              Text(formatted),
            ],
          ),
        ),
      );
    }

    addRow(
      'Current streak',
      learning['currentStreak'] ?? learning['streak'],
      formatter: (value) => '${value} days',
    );
    addRow(
      'Learning time',
      learning['totalLearningTime'],
      formatter: (value) {
        if (value is num) {
          return Utils.formatDuration(Duration(minutes: value.toInt()));
        }
        return value.toString();
      },
    );
    addRow('Upcoming lessons', learning['upcomingLessons']);
    addRow(
      'New achievements',
      learning['achievements'],
      formatter: (value) {
        if (value is List) {
          return value.map((item) => item.toString()).join(', ');
        }
        return value.toString();
      },
    );

    if (rows.isEmpty) {
      return const SizedBox.shrink();
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Learning Highlights',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            ...rows,
          ],
        ),
      ),
    );
  }

  Widget _buildRecentProgressSection(List<Map<String, dynamic>> items) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Recent Activity',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 12),
            ...items.map((data) {
              final title =
                  data['moduleTitle'] ?? data['courseTitle'] ?? 'Course';
              final progress = _readNum(data['progress']);
              final lastAccessed = _parseDate(data['lastAccessedAt']);

              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title.toString(),
                            style: Theme.of(context).textTheme.titleMedium,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          LinearProgressIndicator(
                            value: (progress.clamp(0, 100)) / 100,
                            minHeight: 6,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${progress.toStringAsFixed(0)}% complete',
                            style: Theme.of(context)
                                .textTheme
                                .bodySmall
                                ?.copyWith(color: Colors.grey[600]),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    if (lastAccessed != null)
                      Text(
                        Utils.formatDate(lastAccessed),
                        style: Theme.of(context)
                            .textTheme
                            .bodySmall
                            ?.copyWith(color: Colors.grey[600]),
                      ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildCourseProgressTile(Map<String, dynamic> course) {
    final title = course['courseTitle'] ?? course['title'] ?? 'Course';
    final progress =
        _readNum(course['progress'] ?? course['percentage'] ?? 0);
    final completed = course['completed'] == true ||
        (course['status']?.toString().toLowerCase() == 'completed');
    final lastAccessed = _parseDate(course['lastAccessedAt']);
    final normalizedProgress = (progress.clamp(0, 100)) / 100;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title.toString(),
                    style: Theme.of(context).textTheme.titleMedium,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (completed)
                  Chip(
                    label: const Text('Completed'),
                    backgroundColor: Colors.green.withOpacity(0.1),
                    labelStyle: TextStyle(color: Colors.green[800]),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            LinearProgressIndicator(
              value: normalizedProgress,
              minHeight: 6,
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('${progress.toStringAsFixed(0)}% complete'),
                if (lastAccessed != null)
                  Text(
                    'Updated ${Utils.formatDate(lastAccessed)}',
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall
                        ?.copyWith(color: Colors.grey[600]),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCertificateCard(Map<String, dynamic> certificate) {
    final title =
        certificate['title'] ?? certificate['courseTitle'] ?? 'Certificate';
    final issuer = certificate['issuer'] ?? 'E-Platform';
    final issuedAt =
        _parseDate(certificate['issuedAt'] ?? certificate['createdAt']);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title.toString(),
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(fontWeight: FontWeight.bold),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8),
            Text(
              'Issued by $issuer',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            if (issuedAt != null) ...[
              const SizedBox(height: 4),
              Text(
                'Issued ${Utils.formatDate(issuedAt)}',
                style: Theme.of(context)
                    .textTheme
                    .bodySmall
                    ?.copyWith(color: Colors.grey[600]),
              ),
            ],
            const Spacer(),
            Align(
              alignment: Alignment.bottomRight,
              child: Icon(
                Icons.verified_outlined,
                color: Colors.green[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String message,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 64, color: Colors.grey[400]),
        const SizedBox(height: 12),
        Text(
          title,
          style: Theme.of(context).textTheme.titleMedium,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Text(
          message,
          style: Theme.of(context)
              .textTheme
              .bodySmall
              ?.copyWith(color: Colors.grey[600]),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildRefreshablePlaceholder(Widget child) {
    return RefreshIndicator(
      onRefresh: () => _loadData(forceRefresh: true),
      child: LayoutBuilder(
        builder: (context, constraints) {
          return SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: ConstrainedBox(
              constraints: BoxConstraints(minHeight: constraints.maxHeight),
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(AppConstants.defaultPadding),
                  child: child,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  DateTime? _parseDate(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is String && value.isNotEmpty) {
      return DateTime.tryParse(value);
    }
    return null;
  }

  double _readNum(dynamic value) {
    if (value == null) return 0;
    if (value is num) return value.toDouble();
    return double.tryParse(value.toString()) ?? 0;
  }
}

class _ProgressMetric {
  const _ProgressMetric({
    required this.label,
    required this.value,
    required this.color,
    this.suffix,
  });

  final String label;
  final dynamic value;
  final Color color;
  final String? suffix;

  Widget build(BuildContext context) {
    if (value == null) {
      return const SizedBox.shrink();
    }

    final displayValue = value is num
        ? (suffix == '%'
            ? '${(value as num).toStringAsFixed(0)}$suffix'
            : (value as num).toString())
        : value.toString();

    if (displayValue.isEmpty) {
      return const SizedBox.shrink();
    }

    return Container(
      width: 140,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            displayValue,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: color,
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: Theme.of(context)
                .textTheme
                .bodySmall
                ?.copyWith(color: Colors.grey[700]),
          ),
        ],
      ),
    );
  }
}
        studentViewModel.fetchEnrolledCourses(),
        studentViewModel.fetchProgress(),
        studentViewModel.fetchCertificates(),
        studentViewModel.fetchEnrollmentsWithProgress(
          forceRefresh: forceRefresh || initial,
        ),
        studentViewModel.fetchLearningOverview(
          forceRefresh: forceRefresh || initial,
        ),
        studentViewModel.fetchProgressOverview(
          forceRefresh: forceRefresh || initial,
        ),
      ]);
    } finally {
      if (!mounted) {
  Future<void> _handleSignOut() async {
    final authViewModel = context.read<AuthViewModel>();
    final studentViewModel = context.read<StudentViewModel>();

    await authViewModel.signOut();
    if (!mounted) {
      builder: (context, studentViewModel, _) {
        final tabs = <Widget>[
        ),
      );
    }

    final summary =
        (overview['summary'] as Map?)?.cast<String, dynamic>() ?? const {};
    final courses = (overview['courses'] as List?)
            ?.whereType<Map>()
            .map((course) => Map<String, dynamic>.from(course))
            .toList() ??
        const <Map<String, dynamic>>[];
    final recentProgress = (learningOverview?['recentProgress'] as List?)
            ?.whereType<Map>()
            .map((item) => Map<String, dynamic>.from(item))
            .toList() ??
        const <Map<String, dynamic>>[];

    return RefreshIndicator(
      onRefresh: () => _loadData(forceRefresh: true),
      child: ListView(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        children: [
          _buildProgressSummary(summary, learningOverview),
          if (recentProgress.isNotEmpty) ...[
            const SizedBox(height: AppConstants.defaultPadding),
            _buildRecentProgressSection(recentProgress),
          ],
          const SizedBox(height: AppConstants.defaultPadding),
          if (courses.isNotEmpty) ...[
            Text(
              'Course Progress',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 12),
            ...courses.map(_buildCourseProgressTile).toList(),
          ] else
            _buildEmptyState(
              icon: Icons.menu_book_outlined,
              title: 'No tracked courses yet',
              message: 'Your progress will appear here once you start learning.',
            ),
        ],
      ),
    );
  }

  Widget _buildCertificatesTab(StudentViewModel viewModel) {
    final certificates = viewModel.certificates;

    if (certificates.isEmpty) {
      return _buildRefreshablePlaceholder(
        _buildEmptyState(
          icon: Icons.card_membership_outlined,
          title: 'No certificates yet',
          message: 'Finish a course to earn your first certificate.',
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => _loadData(forceRefresh: true),
      child: GridView.builder(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: AppConstants.defaultPadding,
          mainAxisSpacing: AppConstants.defaultPadding,
          childAspectRatio: 0.75,
        ),
        itemCount: certificates.length,
        itemBuilder: (context, index) {
          final certificate = Map<String, dynamic>.from(certificates[index]);
          return _buildCertificateCard(certificate);
        },
      ),
    );
  }

                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          instructor,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        if (status.isNotEmpty) ...[
                          const SizedBox(height: 6),
                          Chip(
                            label: Text(status.toUpperCase()),
                            backgroundColor: status == 'completed'
                                ? Colors.green.withOpacity(0.1)
                                : Colors.blueGrey.withOpacity(0.1),
                            labelStyle: TextStyle(
                              color: status == 'completed'
                                  ? Colors.green[800]
                                  : Colors.blueGrey[800],
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              LinearProgressIndicator(
                value: normalizedProgress.toDouble(),
                minHeight: 6,
                borderRadius:
                    BorderRadius.circular(AppConstants.borderRadius),
              ),
              const SizedBox(height: 4),
              Text(
                '${constrainedProgress.toStringAsFixed(0)}% Complete',
                style: Theme.of(context).textTheme.bodySmall,
              ),
              if (totalLessons > 0) ...[
                const SizedBox(height: 4),
                Text(
                  '${completedLessons.toString()}/${totalLessons.toString()} lessons completed',
                  style: Theme.of(context)
                      .textTheme
                      .bodySmall
                      ?.copyWith(color: Colors.grey[600]),
                }

          }

          class _ProgressMetric {
    final totalCourses = (summary['totalCourses'] ?? 0) as num;
    final completedCourses = (summary['completedCourses'] ??
            learningOverview?['completedCourses'] ??
            0) as num;
    final inProgressCourses = (summary['inProgressCourses'] ??
            learningOverview?['inProgressCourses'] ??
            0) as num;
    final averageProgress = (summary['averageProgress'] ?? 0) as num;
    final certificatesEarned =
        (learningOverview?['certificatesEarned'] ?? 0) as num;

    final cards = <_ProgressMetric>[
      _ProgressMetric(
        label: 'Total Courses',
        value: totalCourses.toString(),
        color: Colors.blue,
      ),
      _ProgressMetric(
        label: 'Completed',
        value: completedCourses.toString(),
        color: Colors.green,
      ),
      _ProgressMetric(
        label: 'In Progress',
        value: inProgressCourses.toString(),
        color: Colors.orange,
      ),
      _ProgressMetric(
        label: 'Average Progress',
        value: '${averageProgress.toString()}%',
        color: Colors.purple,
      ),
      if (certificatesEarned > 0)
        _ProgressMetric(
          label: 'Certificates',
          value: certificatesEarned.toString(),
          color: Colors.teal,
        ),
    ];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Learning Overview',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: AppConstants.defaultPadding,
              runSpacing: AppConstants.defaultPadding,
              children: cards.map((metric) => metric.build(context)).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentProgressSection(List<Map<String, dynamic>> items) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Recent Activity',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 12),
            ...items.map((item) {
              final title =
                  item['moduleTitle'] ?? item['courseTitle'] ?? 'Course';
              final progress = (item['progress'] ?? 0).toDouble();
              final lastAccessed = _parseDate(item['lastAccessedAt']);

              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: Theme.of(context).textTheme.titleMedium,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          LinearProgressIndicator(
                            value: (progress.clamp(0, 100) / 100).toDouble(),
                            minHeight: 6,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${progress.toStringAsFixed(0)}% complete',
                            style: Theme.of(context)
                                .textTheme
                                .bodySmall
                                ?.copyWith(color: Colors.grey[600]),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    if (lastAccessed != null)
                      Text(
                        Utils.formatDate(lastAccessed),
                        style: Theme.of(context)
                            .textTheme
                            .bodySmall
                            ?.copyWith(color: Colors.grey[600]),
                      ),
                  ],
                ),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildCourseProgressTile(Map<String, dynamic> course) {
    final progress = (course['progress'] ?? 0).toDouble();
    final completed = course['completed'] == true;
    final lastAccessed = _parseDate(course['lastAccessedAt']);

    return Card(
      margin: const EdgeInsets.only(bottom: AppConstants.defaultPadding),
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    course['courseTitle'] ?? 'Course',
                    style: Theme.of(context).textTheme.titleMedium,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (completed)
                  Chip(
                    label: const Text('Completed'),
                    backgroundColor: Colors.green.withOpacity(0.1),
                    labelStyle: TextStyle(
                      color: Colors.green[800],
                      fontWeight: FontWeight.w600,
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: (progress.clamp(0, 100) / 100).toDouble(),
              minHeight: 6,
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${progress.toStringAsFixed(0)}% complete',
                  style: Theme.of(context)
                      .textTheme
                      .bodySmall
                      ?.copyWith(color: Colors.grey[600]),
                ),
                if (lastAccessed != null)
                  Text(
                    'Updated ${Utils.formatDate(lastAccessed)}',
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall
                        ?.copyWith(color: Colors.grey[600]),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCertificateCard(Map<String, dynamic> certificate) {
    final title =
        certificate['title'] ?? certificate['courseTitle'] ?? 'Certificate';
    final issuer = certificate['issuer'] ?? 'E-Platform';
    final issuedAt =
        _parseDate(certificate['issuedAt'] ?? certificate['createdAt']);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(fontWeight: FontWeight.bold),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 6),
            Text(
              certificate['courseTitle'] ?? title,
              style: Theme.of(context)
                  .textTheme
                  .bodySmall
                  ?.copyWith(color: Colors.grey[700]),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 12),
            Text(
              'Issued by $issuer',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            if (issuedAt != null) ...[
              const SizedBox(height: 6),
              Text(
                'Issued ${Utils.formatDate(issuedAt)}',
                style: Theme.of(context)
                    .textTheme
                    .bodySmall
                    ?.copyWith(color: Colors.grey[600]),
              ),
            ],
            const Spacer(),
            Align(
              alignment: Alignment.bottomRight,
              child: Icon(Icons.verified_outlined, color: Colors.green[600]),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String message,
    String? actionLabel,
    VoidCallback? onAction,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 64, color: Colors.grey[400]),
        const SizedBox(height: 12),
        Text(
          title,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 6),
        Text(
          message,
          textAlign: TextAlign.center,
          style: Theme.of(context)
              .textTheme
              .bodySmall
              ?.copyWith(color: Colors.grey[600]),
        ),
        if (actionLabel != null && onAction != null) ...[
          const SizedBox(height: 16),
          ElevatedButton(onPressed: onAction, child: Text(actionLabel)),
        ],
      ],
    );
  }

  Widget _buildRefreshablePlaceholder(Widget child) {
    return RefreshIndicator(
      onRefresh: () => _loadData(forceRefresh: true),
      child: LayoutBuilder(
        builder: (context, constraints) {
          return SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: ConstrainedBox(
              constraints: BoxConstraints(minHeight: constraints.maxHeight),
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(AppConstants.defaultPadding),
                  child: child,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  DateTime? _parseDate(dynamic value) {
    if (value is DateTime) {
      return value;
    }
    if (value is String) {
      return DateTime.tryParse(value);
    }
    return null;
  }
}

class _ProgressMetric {
  const _ProgressMetric({
    required this.label,
    required this.value,
    required this.color,
  });

  final String label;
  final String value;
  final Color color;

  Widget build(BuildContext context) {
    return Container(
      width: 140,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: color,
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: Theme.of(context)
                .textTheme
                .bodySmall
                ?.copyWith(color: Colors.grey[700]),
          ),
        ],
      ),
    );
  }
}
      Widget _buildCourseProgressTile(Map<String, dynamic> course) {
        final progress = (course['progress'] ?? 0).toDouble();
        final completed = course['completed'] == true;
        final lastAccessedRaw = course['lastAccessedAt'];
        final lastAccessed = lastAccessedRaw is String
            ? DateTime.tryParse(lastAccessedRaw)
            : lastAccessedRaw is DateTime
                ? lastAccessedRaw
                : null;

        return Card(
          margin: const EdgeInsets.only(bottom: AppConstants.defaultPadding),
          child: Padding(
            padding: const EdgeInsets.all(AppConstants.defaultPadding),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        course['courseTitle'] ?? 'Course',
                        style: Theme.of(context).textTheme.titleMedium,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (completed)
                      Chip(
                        label: const Text('Completed'),
                        backgroundColor: Colors.green.withOpacity(0.1),
                        labelStyle: TextStyle(
                          color: Colors.green[800],
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: (progress.clamp(0, 100) / 100).toDouble(),
                  minHeight: 6,
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${progress.toStringAsFixed(0)}% complete',
                      style: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.copyWith(color: Colors.grey[600]),
                    ),
                    if (lastAccessed != null)
                      Text(
                        'Updated ${Utils.formatDate(lastAccessed)}',
                        style: Theme.of(context)
                            .textTheme
                            .bodySmall
                            ?.copyWith(color: Colors.grey[600]),
                      ),
                  ],
                ),
              ],
            ),
          ),
        );
      }
                ],
                if (lastAccessed != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    'Last accessed ${Utils.formatDateTime(lastAccessed)}',
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall
                        ?.copyWith(color: Colors.grey[600]),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

}

class _ProgressMetric {
  const _ProgressMetric({
    required this.label,
    required this.value,
    required this.color,
  });

  final String label;
  final String value;
  final Color color;

  Widget build(BuildContext context) {
    return Container(
      width: 140,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: color,
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: Theme.of(context)
                .textTheme
                .bodySmall
                ?.copyWith(color: Colors.grey[700]),
          ),
        ],
      ),
    );

