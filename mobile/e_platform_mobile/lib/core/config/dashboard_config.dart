/// ====================================================================
/// DASHBOARD CONFIGURATION REGISTRY
/// ====================================================================
///
/// DATA FLOW ARCHITECTURE:
/// ----------------------
/// 1. Dashboard ViewModel (AdminViewModel, InstructorViewModel, StudentViewModel)
///    ↓ Fetches data from BFF API via Service layer
/// 2. DynamicDashboard Widget
///    ↓ Receives data via Provider Consumer
/// 3. propsMap Function (defined per role in DashboardConfigRegistry)
///    ↓ Maps dashboard data to widget-specific props
/// 4. Widget Registry (WidgetRegistry)
///    ↓ Provides widget builders by ID
/// 5. Widget Components
///    ↓ Render using data from propsMap
///
/// EXAMPLE FLOW:
/// -------------
/// AdminViewModel.fetchDashboard() → { stats: {...}, revenueChart: {...} }
///   ↓
/// DynamicDashboard receives data via Consumer<AdminViewModel>
///   ↓
/// config.propsMap(data) → { 'admin-stats': data['stats'], ... }
///   ↓
/// WidgetRegistry.getWidget('admin-stats', data['stats']) → DashboardStatsCards
///   ↓
/// DashboardStatsCards(role: 'admin', data: {...})
///
/// KEY CONCEPTS:
/// ------------
/// - propsMap: Transforms ViewModel data into widget-specific data
/// - Widget Registry: Maps widget IDs to Flutter Widget builders
/// - Sections: Define dashboard layout structure
/// - Role-based Config: Each role has its own configuration
/// 
/// ====================================================================

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
  final String role;
  final String title;
  final RoleMetadata? metadata;
  final String requiredPermission;
  final String dataSource; // ViewModel name
  final Map<String, dynamic> Function(Map<String, dynamic>?) propsMap;
  final List<DashboardSection> sections;

  const DashboardConfig({
    required this.role,
    required this.title,
    this.metadata,
    required this.requiredPermission,
    required this.dataSource,
    required this.propsMap,
    required this.sections,
  });
}

/// ====================================================================
/// ROLE METADATA
/// Defines metadata for each role including permissions and UI properties
/// ====================================================================

class RoleMetadata {
  final String label;
  final String description;
  final String permission;
  final String dashboardPath;
  final int priority; // Lower = higher priority
  final Color color;
  final IconData icon;

  const RoleMetadata({
    required this.label,
    required this.description,
    required this.permission,
    required this.dashboardPath,
    required this.priority,
    required this.color,
    required this.icon,
  });
}

class RoleMetadataRegistry {
  static const Map<String, RoleMetadata> roles = {
    'admin': RoleMetadata(
      label: 'Administrator',
      description: 'Full platform access and management',
      permission: 'isAdmin',
      dashboardPath: '/dashboard/admin',
      priority: 1,
      color: Color(0xFFEF4444), // red-500
      icon: Icons.admin_panel_settings,
    ),
    'instructor': RoleMetadata(
      label: 'Instructor',
      description: 'Course creation and student management',
      permission: 'isInstructor',
      dashboardPath: '/dashboard/instructor',
      priority: 2,
      color: Color(0xFF3B82F6), // blue-500
      icon: Icons.school,
    ),
    'student': RoleMetadata(
      label: 'Student',
      description: 'Course enrollment and learning',
      permission: 'isStudent',
      dashboardPath: '/dashboard/student',
      priority: 3,
      color: Color(0xFF10B981), // green-500
      icon: Icons.person,
    ),
  };

  static RoleMetadata? getMetadata(String role) => roles[role];
}

/// ====================================================================
/// WIDGET REGISTRY
/// Maps widget IDs to their builder functions with metadata
/// ====================================================================

class WidgetMetadata {
  final String label;
  final String description;
  final String role;
  final List<String> requiredData;

  const WidgetMetadata({
    required this.label,
    required this.description,
    required this.role,
    required this.requiredData,
  });
}

class WidgetRegistry {
  static final Map<String, WidgetMetadata> _metadata = {
    // Admin Dashboard Widgets
    'admin-stats': WidgetMetadata(
      label: 'Platform Statistics',
      description: 'Overview of platform metrics',
      role: 'admin',
      requiredData: ['stats'],
    ),
    'admin-revenue-chart': WidgetMetadata(
      label: 'Revenue Chart',
      description: 'Revenue trends and analytics',
      role: 'admin',
      requiredData: ['revenueChart'],
    ),
    'admin-recent-activity': WidgetMetadata(
      label: 'Recent Activity',
      description: 'Latest platform activities',
      role: 'admin',
      requiredData: ['recentActivity'],
    ),
    'admin-course-performance': WidgetMetadata(
      label: 'Course Performance',
      description: 'Course analytics and metrics',
      role: 'admin',
      requiredData: ['coursePerformance'],
    ),
    'admin-user-engagement': WidgetMetadata(
      label: 'User Engagement',
      description: 'User activity and engagement metrics',
      role: 'admin',
      requiredData: ['userEngagement'],
    ),

    // Instructor Dashboard Widgets
    'instructor-stats': WidgetMetadata(
      label: 'Instructor Statistics',
      description: 'Teaching performance metrics',
      role: 'instructor',
      requiredData: ['stats'],
    ),
    'instructor-revenue-trends': WidgetMetadata(
      label: 'Revenue Trends',
      description: 'Earning trends over time',
      role: 'instructor',
      requiredData: ['revenueTrends'],
    ),
    'instructor-recent-activity': WidgetMetadata(
      label: 'Recent Activity',
      description: 'Latest course activities',
      role: 'instructor',
      requiredData: ['recentActivity'],
    ),
    'instructor-course-performance': WidgetMetadata(
      label: 'Course Performance',
      description: 'Individual course metrics',
      role: 'instructor',
      requiredData: ['coursePerformance'],
    ),
    'instructor-my-courses': WidgetMetadata(
      label: 'My Courses',
      description: 'Course management overview',
      role: 'instructor',
      requiredData: ['courses'],
    ),

    // Student Dashboard Widgets
    'student-stats': WidgetMetadata(
      label: 'Learning Statistics',
      description: 'Progress and achievements',
      role: 'student',
      requiredData: ['stats'],
    ),
    'student-courses': WidgetMetadata(
      label: 'My Courses',
      description: 'Enrolled courses overview',
      role: 'student',
      requiredData: ['enrolledCourses'],
    ),
    'student-progress': WidgetMetadata(
      label: 'Progress Summary',
      description: 'Learning progress overview',
      role: 'student',
      requiredData: ['progress'],
    ),
  };

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

  /// Get widget builder from registry
  static Widget? getWidget(String widgetId, Map<String, dynamic>? data) {
    final builder = _registry[widgetId];
    return builder?.call(data);
  }

  /// Get widget metadata
  static WidgetMetadata? getMetadata(String widgetId) {
    return _metadata[widgetId];
  }

  /// Get all widgets for a specific role
  static List<String> getWidgetsByRole(String role) {
    return _metadata.entries
        .where((entry) => entry.value.role == role)
        .map((entry) => entry.key)
        .toList();
  }

  /// Check if widget exists in registry
  static bool hasWidget(String widgetId) {
    return _registry.containsKey(widgetId);
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
      role: 'admin',
      title: 'Platform Overview',
      metadata: RoleMetadataRegistry.roles['admin'],
      requiredPermission: 'isAdmin',
      dataSource: 'AdminViewModel',
      
      /// propsMap - Transforms dashboard data into widget-specific data
      /// This function is called by DynamicDashboard to map data to each widget
      /// 
      /// @param dashboardData - Data from AdminViewModel.fetchDashboard()
      /// @returns Map of widgetId → data for that widget
      /// 
      /// DATA MAPPING:
      /// dashboardData['stats'] → 'admin-stats' widget → DashboardStatsCards
      /// dashboardData['revenueChart'] → 'admin-revenue-chart' widget → AdminRevenueChart
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
      role: 'instructor',
      title: 'Instructor Dashboard',
      metadata: RoleMetadataRegistry.roles['instructor'],
      requiredPermission: 'isInstructor',
      dataSource: 'InstructorViewModel',
      
      /// propsMap - Maps instructor dashboard data to widget data
      /// Called by DynamicDashboard to distribute data to widgets
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
      role: 'student',
      title: 'My Learning Dashboard',
      metadata: RoleMetadataRegistry.roles['student'],
      requiredPermission: 'isStudent',
      dataSource: 'StudentViewModel',
      
      /// propsMap - Maps student dashboard data to widget data
      /// Supports both data and callback props for interactive widgets
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

  /// Check if a role has a dashboard configuration
  static bool hasConfig(String role) {
    return _configs.containsKey(role);
  }

  /// Get all available dashboard roles
  static List<String> getAvailableRoles() {
    return _configs.keys.toList();
  }

  /// Get all roles sorted by priority
  static List<String> getRolesByPriority() {
    final roles = RoleMetadataRegistry.roles;
    final entries = roles.entries.toList()
      ..sort((a, b) => a.value.priority.compareTo(b.value.priority));
    return entries.map((e) => e.key).toList();
  }
}

/// ====================================================================
/// DASHBOARD UTILITIES
/// ====================================================================

class DashboardUtils {
  /// Validate if user has access to a specific dashboard role
  /// @param user - User object with role booleans { isAdmin, isInstructor, isStudent }
  /// @param dashboardRole - Dashboard role to access
  /// @returns bool - Whether user can access this dashboard
  static bool canAccessDashboard(Map<String, dynamic> user, String dashboardRole) {
    final metadata = RoleMetadataRegistry.getMetadata(dashboardRole);
    if (metadata == null) return false;
    
    final permission = metadata.permission;
    return user[permission] == true;
  }

  /// Get user's primary dashboard role based on boolean priority
  /// Priority: admin > instructor > student
  /// @param user - User object with role booleans
  /// @returns String? - Primary dashboard role or null
  static String? getPrimaryDashboardRole(Map<String, dynamic> user) {
    if (user['isAdmin'] == true) return 'admin';
    if (user['isInstructor'] == true) return 'instructor';
    if (user['isStudent'] == true) return 'student';
    return null;
  }

  /// Get primary dashboard path for user
  /// @param user - User object with role booleans
  /// @returns String - Dashboard path
  static String getPrimaryDashboardPath(Map<String, dynamic> user) {
    final role = getPrimaryDashboardRole(user);
    if (role == null) return '/';
    
    final metadata = RoleMetadataRegistry.getMetadata(role);
    return metadata?.dashboardPath ?? '/';
  }

  /// Get dashboard title based on role booleans
  /// @param user - User object with role booleans
  /// @returns String - Dashboard title
  static String getDashboardTitle(Map<String, dynamic> user) {
    final role = getPrimaryDashboardRole(user);
    if (role == null) return 'Dashboard';
    
    final config = DashboardConfigRegistry.getConfig(role);
    return config?.title ?? 'Dashboard';
  }

  /// Validate dashboard configuration
  /// @param role - Role to validate
  /// @returns Map with validation results
  static Map<String, dynamic> validateDashboardConfig(String role) {
    final errors = <String>[];
    final config = DashboardConfigRegistry.getConfig(role);
    
    if (config == null) {
      errors.add('No configuration found for role: $role');
      return {'valid': false, 'errors': errors};
    }
    
    // Validate required fields
    if (config.title.isEmpty) errors.add('Missing title');
    if (config.sections.isEmpty) errors.add('Missing or empty sections');
    
    // Validate widgets exist in registry
    for (final section in config.sections) {
      if (section.widgetId != null && !WidgetRegistry.hasWidget(section.widgetId!)) {
        errors.add('Widget not found in registry: ${section.widgetId}');
      }
      if (section.children != null) {
        for (final child in section.children!) {
          if (child.widgetId != null && !WidgetRegistry.hasWidget(child.widgetId!)) {
            errors.add('Child widget not found in registry: ${child.widgetId}');
          }
        }
      }
    }
    
    return {'valid': errors.isEmpty, 'errors': errors};
  }

  /// Get dashboard summary for a role
  /// @param role - Role name
  /// @returns Map with dashboard summary
  static Map<String, dynamic>? getDashboardSummary(String role) {
    final config = DashboardConfigRegistry.getConfig(role);
    final metadata = RoleMetadataRegistry.getMetadata(role);
    
    if (config == null || metadata == null) return null;
    
    int widgetCount = 0;
    for (final section in config.sections) {
      if (section.widgetId != null) widgetCount++;
      if (section.children != null) widgetCount += section.children!.length;
    }
    
    return {
      'role': role,
      'title': config.title,
      'label': metadata.label,
      'description': metadata.description,
      'widgetCount': widgetCount,
      'dashboardPath': metadata.dashboardPath,
      'dataSource': config.dataSource,
      'permission': metadata.permission,
    };
  }

  /// Get all dashboard summaries
  static List<Map<String, dynamic>> getAllDashboardSummaries() {
    return DashboardConfigRegistry.getAvailableRoles()
        .map((role) => getDashboardSummary(role))
        .whereType<Map<String, dynamic>>()
        .toList();
  }

  /// Trace widget data source
  /// Shows exactly where a widget's data comes from
  static Map<String, dynamic>? traceWidgetDataSource(String widgetId) {
    final widgetMeta = WidgetRegistry.getMetadata(widgetId);
    if (widgetMeta == null) return null;
    
    final role = widgetMeta.role;
    final config = DashboardConfigRegistry.getConfig(role);
    if (config == null) return null;
    
    return {
      'widgetId': widgetId,
      'role': role,
      'dataSource': config.dataSource,
      'requiredData': widgetMeta.requiredData,
      'label': widgetMeta.label,
      'description': widgetMeta.description,
      'trace': {
        'step1': '${config.dataSource}.fetchDashboard() calls BFF API',
        'step2': 'Returns data with fields: ${widgetMeta.requiredData.join(", ")}',
        'step3': 'DynamicDashboard receives data via Consumer<${config.dataSource}>',
        'step4': 'config.propsMap extracts: data[\'${widgetMeta.requiredData.first}\']',
        'step5': 'WidgetRegistry provides widget builder for \'$widgetId\'',
        'step6': 'Widget renders with extracted data',
      }
    };
  }
}
