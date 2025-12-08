/// Dashboard Configuration
/// Defines layout and widgets for each role's dashboard
/// Following the web's DynamicDashboard pattern adapted for Flutter

import 'package:flutter/material.dart';

// Centralized Shared Widgets
import '../../View/Dashboard/Widgets/Shared/dashboard_stats_cards.dart';
import '../../View/Dashboard/Widgets/Shared/dashboard_recent_activity.dart';
import '../../View/Dashboard/Widgets/Shared/dashboard_course_performance.dart';

// Role-specific widgets (kept for special cases)
import '../../View/Dashboard/Widgets/Admin/revenue_chart.dart';
import '../../View/Dashboard/Widgets/Admin/user_engagement.dart';
import '../../View/Dashboard/Widgets/Instructor/revenue_trends.dart';
import '../../View/Dashboard/Widgets/Instructor/my_courses.dart';
import '../../View/Dashboard/Widgets/Student/enrolled_courses.dart';
import '../../View/Dashboard/Widgets/Student/progress_summary.dart';

/// Widget builder function type
typedef WidgetBuilder = Widget Function(Map<String, dynamic>? data);

/// Dashboard section configuration
class DashboardSection {
  final String id;
  final String? widgetId;
  final SectionType type;
  final int? crossAxisCount;
  final double? childAspectRatio;
  final List<DashboardSection>? children;
  final EdgeInsets? padding;

  const DashboardSection({
    required this.id,
    this.widgetId,
    this.type = SectionType.single,
    this.crossAxisCount,
    this.childAspectRatio,
    this.children,
    this.padding,
  });
}

enum SectionType {
  single, // Single widget
  grid, // Grid of widgets
  list, // List of widgets
}

/// Dashboard configuration for a specific role
class DashboardConfig {
  final String title;
  final Map<String, dynamic> Function(Map<String, dynamic>?) propsMap;
  final List<DashboardSection> sections;

  const DashboardConfig({
    required this.title,
    required this.propsMap,
    required this.sections,
  });
}

/// Widget Registry
/// Maps widget IDs to their builder functions
class WidgetRegistry {
  static final Map<String, WidgetBuilder> _registry = {
    // Centralized Stats Cards (role-based)
    'admin-stats': (data) => DashboardStatsCards(role: 'admin', data: data),
    'instructor-stats': (data) => DashboardStatsCards(role: 'instructor', data: data),
    'student-stats': (data) => DashboardStatsCards(role: 'student', data: data),

    // Centralized Recent Activity (role-based)
    'admin-recent-activity': (data) => DashboardRecentActivity(role: 'admin', data: data, maxItems: 10),
    'instructor-recent-activity': (data) => DashboardRecentActivity(role: 'instructor', data: data, maxItems: 5),
    'student-recent-activity': (data) => DashboardRecentActivity(role: 'student', data: data, maxItems: 5),

    // Centralized Course Performance (role-based)
    'admin-course-performance': (data) => DashboardCoursePerformance(role: 'admin', data: data),
    'instructor-course-performance': (data) => DashboardCoursePerformance(role: 'instructor', data: data),
    'student-course-performance': (data) => DashboardCoursePerformance(role: 'student', data: data),

    // Role-specific widgets (special functionality)
    'admin-revenue-chart': (data) => AdminRevenueChart(data: data),
    'admin-user-engagement': (data) => AdminUserEngagement(data: data),
    'instructor-revenue-trends': (data) => InstructorRevenueTrends(data: data),
    'instructor-my-courses': (data) => InstructorMyCourses(data: data),
    'student-courses': (data) => StudentEnrolledCourses(data: data),
    'student-progress': (data) => StudentProgressSummary(data: data),
  };

  static Widget? getWidget(String widgetId, Map<String, dynamic>? data) {
    final builder = _registry[widgetId];
    return builder?.call(data);
  }
}

/// Dashboard Configuration Registry
class DashboardConfigRegistry {
  static final Map<String, DashboardConfig> _configs = {
    // ----------------------------------------------------------------
    // ADMIN DASHBOARD
    // Data Source: AdminViewModel.fetchDashboard()
    // Returns: { stats: {...}, recentActivity: [...], coursePerformance: [...], etc. }
    // ----------------------------------------------------------------
    'admin': DashboardConfig(
      title: 'Platform Overview',
      propsMap: (dashboardData) => {
        'admin-stats': dashboardData?['stats'],
        'admin-revenue-chart': dashboardData?['revenueChart'],
        'admin-recent-activity': dashboardData?['recentActivity'],
        'admin-course-performance': dashboardData?['coursePerformance'],
        'admin-user-engagement': dashboardData?['userEngagement'],
      },
      sections: [
        // Row 1: Stats Cards (full width)
        DashboardSection(
          id: 'stats',
          widgetId: 'admin-stats',
          padding: EdgeInsets.only(bottom: 16),
        ),
        // Row 2: Recent Activity & Course Performance (grid)
        DashboardSection(
          id: 'activity-courses',
          type: SectionType.grid,
          crossAxisCount: 2,
          childAspectRatio: 1.0,
          padding: EdgeInsets.only(bottom: 16),
          children: [
            DashboardSection(
              id: 'activity',
              widgetId: 'admin-recent-activity',
            ),
            DashboardSection(
              id: 'courses',
              widgetId: 'admin-course-performance',
            ),
          ],
        ),
        // Row 3: User Engagement (full width)
        DashboardSection(
          id: 'engagement',
          widgetId: 'admin-user-engagement',
        ),
      ],
    ),

    // ----------------------------------------------------------------
    // INSTRUCTOR DASHBOARD
    // Data Source: InstructorViewModel.fetchDashboard()
    // Returns: { stats: {...}, courses: [...], revenueTrends: {...}, etc. }
    // ----------------------------------------------------------------
    'instructor': DashboardConfig(
      title: 'Instructor Dashboard',
      propsMap: (dashboardData) => {
        'instructor-stats': dashboardData?['stats'],
        'instructor-my-courses': dashboardData?['courses'],
        'instructor-revenue-trends': dashboardData?['revenueTrends'],
        'instructor-recent-activity': dashboardData?['recentActivity'],
        'instructor-course-performance': dashboardData?['coursePerformance'],
      },
      sections: [
        // Row 1: Stats Cards (full width)
        DashboardSection(
          id: 'stats',
          widgetId: 'instructor-stats',
          padding: EdgeInsets.only(bottom: 16),
        ),
        // Row 2: My Courses (full width)
        DashboardSection(
          id: 'my-courses',
          widgetId: 'instructor-my-courses',
          padding: EdgeInsets.only(bottom: 16),
        ),
        // Row 3: Revenue Trends & Recent Activity (grid)
        DashboardSection(
          id: 'trends-activity',
          type: SectionType.grid,
          crossAxisCount: 2,
          childAspectRatio: 1.2,
          padding: EdgeInsets.only(bottom: 16),
          children: [
            DashboardSection(
              id: 'revenue',
              widgetId: 'instructor-revenue-trends',
            ),
            DashboardSection(
              id: 'activity',
              widgetId: 'instructor-recent-activity',
            ),
          ],
        ),
        // Row 4: Course Performance (full width)
        DashboardSection(
          id: 'performance',
          widgetId: 'instructor-course-performance',
        ),
      ],
    ),

    // ----------------------------------------------------------------
    // STUDENT DASHBOARD
    // Data Source: StudentViewModel.fetchDashboard()
    // Returns: { stats: {...}, enrolledCourses: [...], progress: {...}, etc. }
    // ----------------------------------------------------------------
    'student': DashboardConfig(
      title: 'My Learning Dashboard',
      propsMap: (dashboardData) => {
        'student-stats': dashboardData?['stats'],
        'student-courses': dashboardData?['enrolledCourses'],
        'student-progress': dashboardData?['progress'],
      },
      sections: [
        // Row 1: Stats Cards (full width)
        DashboardSection(
          id: 'stats',
          widgetId: 'student-stats',
          padding: EdgeInsets.only(bottom: 16),
        ),
        // Row 2: Enrolled Courses (full width)
        DashboardSection(
          id: 'courses',
          widgetId: 'student-courses',
          padding: EdgeInsets.only(bottom: 16),
        ),
        // Row 3: Progress Summary (full width)
        DashboardSection(
          id: 'progress',
          widgetId: 'student-progress',
        ),
      ],
    ),
  };

  /// Get dashboard configuration for a specific role
  static DashboardConfig? getConfig(String role) {
    return _configs[role];
  }
}
