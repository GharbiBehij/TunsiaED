import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../ViewModel/Admin/admin_viewmodel.dart';
import '../../ViewModel/Auth/auth_viewmodel.dart';
import '../../ViewModel/Instructor/instructor_viewmodel.dart';
import '../../ViewModel/Student/student_viewmodel.dart';
import '../../core/utils/constants.dart';
import '../Auth/login_screen.dart';
import 'dynamic_dashboard.dart';

/// Entry point dashboard that routes to the actor-specific dashboard
/// based on the authenticated user's role. Mirrors the web implementation
/// where the DynamicDashboard component switches behaviour using hooks.
class RoleBasedDashboardScreen extends StatefulWidget {
  const RoleBasedDashboardScreen({Key? key}) : super(key: key);

  @override
  State<RoleBasedDashboardScreen> createState() => _RoleBasedDashboardScreenState();
}

class _RoleBasedDashboardScreenState extends State<RoleBasedDashboardScreen> {
  bool _attemptedRoleReload = false;
  final Set<String> _initialFetchTriggered = {};

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _ensureRoleLoaded();
    });
  }

  Future<void> _ensureRoleLoaded() async {
    final authViewModel = context.read<AuthViewModel>();
    if (_attemptedRoleReload) {
      return;
    }

    if (authViewModel.isAuthenticated && authViewModel.userRole == null) {
      _attemptedRoleReload = true;
      await authViewModel.reloadUser();
      if (mounted) {
        setState(() {});
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthViewModel>(
      builder: (context, authViewModel, _) {
        if (authViewModel.isLoading && authViewModel.userRole == null) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (!authViewModel.isAuthenticated) {
          _attemptedRoleReload = false;
          _initialFetchTriggered.clear();
          return const LoginScreen();
        }

        final role = authViewModel.userRole;
        switch (role) {
          case AppConstants.roleAdmin:
            return _buildAdminDashboard();
          case AppConstants.roleInstructor:
            return _buildInstructorDashboard();
          case AppConstants.roleStudent:
            return _buildStudentDashboard();
          default:
            return _UnknownRoleScreen(onSignOut: authViewModel.signOut);
        }
      },
    );
  }

  void _triggerInitialFetch(String role, Future<void> Function() fetcher) {
    if (_initialFetchTriggered.contains(role)) {
      return;
    }
    _initialFetchTriggered.add(role);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      fetcher();
    });
  }

  Widget _buildAdminDashboard() {
    return Consumer<AdminViewModel>(
      builder: (context, viewModel, _) {
        if (viewModel.dashboard == null && !viewModel.isLoading) {
          _triggerInitialFetch(AppConstants.roleAdmin, viewModel.fetchDashboard);
        }

        return _RoleDashboardScaffold(
          role: AppConstants.roleAdmin,
          isLoading: viewModel.isLoading,
          dashboardData: viewModel.dashboard,
          error: viewModel.error,
          onRefresh: viewModel.fetchDashboard,
        );
      },
    );
  }

  Widget _buildInstructorDashboard() {
    return Consumer<InstructorViewModel>(
      builder: (context, viewModel, _) {
        if (viewModel.dashboard == null && !viewModel.isLoading) {
          _triggerInitialFetch(
            AppConstants.roleInstructor,
            viewModel.fetchDashboard,
          );
        }

        return _RoleDashboardScaffold(
          role: AppConstants.roleInstructor,
          isLoading: viewModel.isLoading,
          dashboardData: viewModel.dashboard,
          error: viewModel.error,
          onRefresh: viewModel.fetchDashboard,
        );
      },
    );
  }

  Widget _buildStudentDashboard() {
    return Consumer<StudentViewModel>(
      builder: (context, viewModel, _) {
        if (viewModel.dashboard == null && !viewModel.isLoading) {
          _triggerInitialFetch(AppConstants.roleStudent, viewModel.fetchDashboard);
        }

        return _RoleDashboardScaffold(
          role: AppConstants.roleStudent,
          isLoading: viewModel.isLoading,
          dashboardData: viewModel.dashboard,
          error: viewModel.error,
          onRefresh: viewModel.fetchDashboard,
        );
      },
    );
  }
}

class _UnknownRoleScreen extends StatelessWidget {
  const _UnknownRoleScreen({required this.onSignOut});

  final Future<void> Function() onSignOut;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard')),
      body: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Icon(Icons.warning_amber_rounded, size: 64, color: Colors.orange),
            const SizedBox(height: 16),
            const Text(
              'Unknown role detected',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text(
              'We could not determine the correct dashboard for your account.',
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () async {
                await onSignOut();
                final navigator = Navigator.of(context);
                if (!navigator.mounted) {
                  return;
                }
                navigator.pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (route) => false,
                );
              },
              icon: const Icon(Icons.logout),
              label: const Text('Sign out'),
            ),
          ],
        ),
      ),
    );
  }
}

class _RoleDashboardScaffold extends StatelessWidget {
  const _RoleDashboardScaffold({
    required this.role,
    required this.isLoading,
    required this.dashboardData,
    required this.error,
    required this.onRefresh,
  });

  final String role;
  final bool isLoading;
  final Map<String, dynamic>? dashboardData;
  final String? error;
  final Future<void> Function() onRefresh;

  @override
  Widget build(BuildContext context) {
    final title = _titleForRole(role);

    Widget content = DynamicDashboard(
      role: role,
      dashboardData: dashboardData,
      isLoading: isLoading,
      error: error,
      onRetry: onRefresh,
    );

    if (dashboardData != null) {
      content = RefreshIndicator(
        onRefresh: onRefresh,
        child: content,
      );
    }

    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: content,
    );
  }

  String _titleForRole(String role) {
    switch (role) {
      case AppConstants.roleAdmin:
        return 'Admin Dashboard';
      case AppConstants.roleInstructor:
        return 'Instructor Dashboard';
      case AppConstants.roleStudent:
        return 'Student Dashboard';
      default:
        return 'Dashboard';
    }
  }
}
