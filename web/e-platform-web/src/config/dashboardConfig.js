// Dashboard Configuration - Defines layout and widgets for each role
// Widgets receive data from the propsMap function that maps dashboard data to widget props

// ====================================================================
// WIDGET IMPORTS
// ====================================================================

// Admin Dashboard Widgets
import StatsCards from '../components/Dashboard/AdminDashboard/StatsCards';
import RevenueChart from '../components/Dashboard/AdminDashboard/RevenueChart';
import RecentActivity from '../components/Dashboard/AdminDashboard/RecentActivity';
import CoursePerformance from '../components/Dashboard/AdminDashboard/CoursePerformance';
import UserEngagement from '../components/Dashboard/AdminDashboard/UserEngagement';
import ActivePromotions from '../components/Dashboard/AdminDashboard/ActivePromotions';
import SubscriptionPlans from '../components/Dashboard/AdminDashboard/SubscriptionPlans';
import SubscriptionStats from '../components/Dashboard/AdminDashboard/SubscriptionStats';

// Instructor Dashboard Widgets
import InstructorStatsCards from '../components/Dashboard/InstructorDashboard/StatsCards';
import RevenueTrends from '../components/Dashboard/InstructorDashboard/RevenueTrends';
import InstructorRecentActivity from '../components/Dashboard/InstructorDashboard/RecentActivity';
import InstructorCoursePerformance from '../components/Dashboard/InstructorDashboard/CoursePerformance';
import MyCourses from '../components/Dashboard/InstructorDashboard/MyCourses';

// Student Dashboard Widgets
import StatsSection from '../components/Dashboard/StudentDashboard/Courses/StatsSection';
import StudentCoursesSection from '../components/Dashboard/StudentDashboard/Courses/StudentCoursesSection';
import { ShoppingCartWidget, SecureCheckout } from '../components/Dashboard/StudentDashboard/Payment';

// ====================================================================
// WIDGET REGISTRY
// Maps widget IDs to React components
// ====================================================================

export const WIDGET_REGISTRY = {
  // Admin Dashboard Widgets
  'admin-stats': StatsCards,
  'admin-revenue-chart': RevenueChart,
  'admin-recent-activity': RecentActivity,
  'admin-course-performance': CoursePerformance,
  'admin-user-engagement': UserEngagement,
  'admin-active-promotions': ActivePromotions,
  'admin-subscription-plans': SubscriptionPlans,
  'admin-subscription-stats': SubscriptionStats,
  
  // Instructor Dashboard Widgets
  'instructor-stats': InstructorStatsCards,
  'instructor-revenue-trends': RevenueTrends,
  'instructor-recent-activity': InstructorRecentActivity,
  'instructor-course-performance': InstructorCoursePerformance,
  'instructor-my-courses': MyCourses,
  
  // Student Dashboard Widgets
  'student-stats': StatsSection,
  'student-courses': StudentCoursesSection,
  'student-cart': ShoppingCartWidget,
  'student-checkout': SecureCheckout,
};

// ====================================================================
// DASHBOARD CONFIGURATIONS
// Each role has: title, propsMap (data → widget props), sections (layout)
// ====================================================================

export const DASHBOARD_CONFIG = {
  // ----------------------------------------------------------------
  // ADMIN DASHBOARD
  // Data Source: useAdminDashboard (frontend aggregation)
  // Returns: { stats, revenueChart, recentActivity, coursePerformance, 
  //            userEngagement, activePromotions, subscriptionPlans, subscriptionStats }
  // ----------------------------------------------------------------
  admin: {
    title: 'Platform Overview',
    propsMap: (dashboardData, isLoading, isError) => ({
      'admin-stats': { data: dashboardData?.stats, isLoading, isError },
      'admin-revenue-chart': { data: dashboardData?.revenueChart, isLoading, isError },
      'admin-recent-activity': { data: dashboardData?.recentActivity, isLoading, isError },
      'admin-course-performance': { data: dashboardData?.coursePerformance, isLoading, isError },
      'admin-user-engagement': { data: dashboardData?.userEngagement, isLoading, isError },
      'admin-active-promotions': { data: dashboardData?.activePromotions, isLoading, isError },
      'admin-subscription-plans': { data: dashboardData?.subscriptionPlans, isLoading, isError },
      'admin-subscription-stats': { data: dashboardData?.subscriptionStats, isLoading, isError },
    }),
    sections: [
      // Row 1: Stats Cards (full width)
      { id: 'stats', widget: 'admin-stats', className: 'mb-8' },
      // Row 2: Revenue Chart (2/3) + Recent Activity (1/3)
      {
        id: 'main-row', type: 'grid', grid: 'grid-cols-1 lg:grid-cols-3 gap-6 mt-8',
        children: [
          { id: 'chart', widget: 'admin-revenue-chart', span: 'lg:col-span-2' },
          { id: 'activity', widget: 'admin-recent-activity' },
        ]
      },
      // Row 3: Course Performance + User Engagement
      {
        id: 'bottom-row', type: 'grid', grid: 'grid-cols-1 lg:grid-cols-2 gap-6 mt-8',
        children: [
          { id: 'courses', widget: 'admin-course-performance' },
          { id: 'users', widget: 'admin-user-engagement' },
        ]
      },
      // Row 4: Promotions + Subscriptions
      {
        id: 'admin-extra-row', type: 'grid', grid: 'grid-cols-1 md:grid-cols-3 gap-6 mt-8',
        children: [
          { id: 'promotions', widget: 'admin-active-promotions' },
          { id: 'subscription-plans', widget: 'admin-subscription-plans' },
          { id: 'subscription-stats', widget: 'admin-subscription-stats' },
        ]
      },
    ],
  },

  // ----------------------------------------------------------------
  // INSTRUCTOR DASHBOARD
  // Data Source: useInstructorDashboard (backend orchestrator)
  // Returns: { stats, revenueTrends, recentActivity, coursePerformance }
  // ----------------------------------------------------------------
  instructor: {
    title: 'Instructor Dashboard',
    propsMap: (dashboardData, isLoading, isError) => ({
      'instructor-stats': { data: dashboardData?.stats, isLoading, isError },
      'instructor-revenue-trends': { data: dashboardData?.revenueTrends, isLoading, isError },
      'instructor-recent-activity': { data: dashboardData?.recentActivity, isLoading, isError },
      'instructor-course-performance': { data: dashboardData?.coursePerformance, isLoading, isError },
      'instructor-my-courses': { data: dashboardData?.courses, isLoading, isError },
    }),
    sections: [
      // Row 1: Stats Cards (full width)
      { id: 'stats', widget: 'instructor-stats', className: 'mb-8' },
      // Row 2: My Courses (full width)
      { id: 'my-courses', widget: 'instructor-my-courses', className: 'mt-8 mb-8' },
      // Row 3: Revenue Trends (2/3) + Recent Activity (1/3)
      {
        id: 'main-row', type: 'grid', grid: 'grid-cols-1 lg:grid-cols-3 gap-6 mt-8',
        children: [
          { id: 'revenue', widget: 'instructor-revenue-trends', span: 'lg:col-span-2' },
          { id: 'activity', widget: 'instructor-recent-activity' },
        ]
      },
      // Row 4: Course Performance (full width)
      { id: 'bottom-row', widget: 'instructor-course-performance', className: 'mt-8' },
    ],
  },

  // ----------------------------------------------------------------
  // STUDENT DASHBOARD
  // Data Source: useStudentDashboard (backend orchestrator)
  // Returns: { stats, courses, cart, checkout }
  // ----------------------------------------------------------------
  student: {
    title: 'My Learning Dashboard',
    propsMap: (dashboardData, isLoading, isError) => ({
      'student-stats': { data: dashboardData?.stats, isLoading, isError },
      'student-courses': { 
        data: dashboardData?.courses, 
        isLoading, 
        isError,
        showTitle: true, 
        title: 'My Courses' 
      },
      'student-cart': { 
        data: dashboardData?.cart, 
        isLoading, 
        isError,
        onCheckout: dashboardData?.onCheckout,
        onRemoveItem: dashboardData?.onRemoveCartItem,
      },
      'student-checkout': { 
        data: dashboardData?.checkout, 
        isLoading, 
        isError,
        onSuccess: dashboardData?.onCheckoutSuccess,
        onCancel: dashboardData?.onCheckoutCancel,
      },
    }),
    sections: [
      // Row 1: Stats Cards (full width)
      { id: 'stats', widget: 'student-stats', className: 'mb-8' },
      // Row 2: Courses Section (full width)
      { id: 'courses', widget: 'student-courses', className: 'mt-8' },
    ],
  },
};

// ====================================================================
// HELPER FUNCTIONS
// ====================================================================

/**
 * Get dashboard configuration for a specific role
 * @param {string} role - User role (admin, instructor, student)
 * @returns {Object} Dashboard configuration
 */
export const getDashboardConfig = (role) => DASHBOARD_CONFIG[role] || DASHBOARD_CONFIG.student;

