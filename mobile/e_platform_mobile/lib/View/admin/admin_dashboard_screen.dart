import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../ViewModel/Admin/admin_viewmodel.dart';
import '../../ViewModel/Auth/auth_viewmodel.dart';
import '../../core/utils/constants.dart';
import '../Auth/login_screen.dart';
import '../Dashboard/dynamic_dashboard.dart';

/// Admin Dashboard Screen
/// Main screen for admin users
class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({Key? key}) : super(key: key);

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final adminViewModel = Provider.of<AdminViewModel>(context, listen: false);
    await adminViewModel.fetchDashboard();
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  Future<void> _handleLogout() async {
    final authViewModel = Provider.of<AuthViewModel>(context, listen: false);
    await authViewModel.signOut();
    
    if (!mounted) return;
    
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              // TODO: Navigate to notifications
            },
          ),
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'logout') {
                _handleLogout();
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'settings',
                child: Text('Settings'),
              ),
              const PopupMenuItem(
                value: 'logout',
                child: Text('Logout'),
              ),
            ],
          ),
        ],
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          _buildDashboardTab(),
          _buildUsersTab(),
          _buildCoursesTab(),
          _buildStatsTab(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.people_outline),
            activeIcon: Icon(Icons.people),
            label: 'Users',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.school_outlined),
            activeIcon: Icon(Icons.school),
            label: 'Courses',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.analytics_outlined),
            activeIcon: Icon(Icons.analytics),
            label: 'Stats',
          ),
        ],
      ),
    );
  }

  Widget _buildDashboardTab() {
    return Consumer<AdminViewModel>(
      builder: (context, viewModel, _) {
        return RefreshIndicator(
          onRefresh: _loadData,
          child: DynamicDashboard(
            role: 'admin',
            dashboardData: viewModel.dashboard,
            isLoading: viewModel.isLoading,
            error: viewModel.error,
            onRetry: _loadData,
          ),
        );
      },
    );
  }

  Widget _buildUsersTab() {
    return const Center(
      child: Text('User management coming soon'),
    );
  }

  Widget _buildCoursesTab() {
    return const Center(
      child: Text('Course management coming soon'),
    );
  }

  Widget _buildStatsTab() {
    return const Center(
      child: Text('Statistics coming soon'),
    );
  }
}
