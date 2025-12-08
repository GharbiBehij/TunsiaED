import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../ViewModel/Instructor/instructor_viewmodel.dart';
import '../../ViewModel/Auth/auth_viewmodel.dart';
import '../../core/utils/constants.dart';
import '../Auth/login_screen.dart';
import '../Dashboard/dynamic_dashboard.dart';

/// Instructor Dashboard Screen
/// Main screen for instructor users
class InstructorDashboardScreen extends StatefulWidget {
  const InstructorDashboardScreen({Key? key}) : super(key: key);

  @override
  State<InstructorDashboardScreen> createState() =>
      _InstructorDashboardScreenState();
}

class _InstructorDashboardScreenState extends State<InstructorDashboardScreen> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final instructorViewModel =
        Provider.of<InstructorViewModel>(context, listen: false);
    await instructorViewModel.fetchDashboard();
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
        title: const Text('Instructor Dashboard'),
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
                value: 'profile',
                child: Text('Profile'),
              ),
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
          _buildCoursesTab(),
          _buildStudentsTab(),
          _buildEarningsTab(),
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
            icon: Icon(Icons.video_library_outlined),
            activeIcon: Icon(Icons.video_library),
            label: 'My Courses',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.people_outline),
            activeIcon: Icon(Icons.people),
            label: 'Students',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.attach_money),
            activeIcon: Icon(Icons.attach_money),
            label: 'Earnings',
          ),
        ],
      ),
      floatingActionButton: _selectedIndex == 1
          ? FloatingActionButton.extended(
              onPressed: () {
                // TODO: Create course
              },
              icon: const Icon(Icons.add),
              label: const Text('Create Course'),
            )
          : null,
    );
  }

  Widget _buildDashboardTab() {
    return Consumer<InstructorViewModel>(
      builder: (context, viewModel, _) {
        return RefreshIndicator(
          onRefresh: _loadData,
          child: DynamicDashboard(
            role: 'instructor',
            dashboardData: viewModel.dashboard,
            isLoading: viewModel.isLoading,
            error: viewModel.error,
            onRetry: _loadData,
          ),
        );
      },
    );
  }

  Widget _buildCoursesTab() {
    return const Center(
      child: Text('Courses management coming soon'),
    );
  }

  Widget _buildStudentsTab() {
    return const Center(
      child: Text('Students list coming soon'),
    );
  }

  Widget _buildEarningsTab() {
    return const Center(
      child: Text('Earnings details coming soon'),
    );
  }
}
