// Dashboard Configuration - Defines layout and widgets for each role
import StatsCards from '../components/Dashboard/AdminDashboard/StatsCards';
import RevenueChart from '../components/Dashboard/AdminDashboard/RevenueChart';
import RecentActivity from '../components/Dashboard/AdminDashboard/RecentActivity';
import CoursePerformance from '../components/Dashboard/AdminDashboard/CoursePerformance';
import UserEngagement from '../components/Dashboard/AdminDashboard/UserEngagement';
import ActivePromotions from '../components/Dashboard/AdminDashboard/ActivePromotions';
import SubscriptionPlans from '../components/Dashboard/AdminDashboard/SubscriptionPlans';
import SubscriptionStats from '../components/Dashboard/AdminDashboard/SubscriptionStats';
import InstructorStatsCards from '../components/Dashboard/InstructorDashboard/StatsCards';
import RevenueTrends from '../components/Dashboard/InstructorDashboard/RevenueTrends';
import InstructorRecentActivity from '../components/Dashboard/InstructorDashboard/RecentActivity';
import InstructorCoursePerformance from '../components/Dashboard/InstructorDashboard/CoursePerformance';
import StatsSection from '../components/Dashboard/StudentDashboard/Courses/StatsSection';
import StudentCoursesSection from '../components/Dashboard/StudentDashboard/Courses/StudentCoursesSection';
import Notifications from '../components/Dashboard/StudentDashboard/Notifcations/Notifications';
export const WIDGET_REGISTRY = {
  // Admin
  'admin-stats': StatsCards,
  'admin-revenue-chart': RevenueChart,
  'admin-recent-activity': RecentActivity,
  'admin-course-performance': CoursePerformance,
  'admin-user-engagement': UserEngagement,
  'admin-active-promotions': ActivePromotions,
  'admin-subscription-plans': SubscriptionPlans,
  'admin-subscription-stats': SubscriptionStats,
  // Instructor
  'instructor-stats': InstructorStatsCards,
  'instructor-revenue-trends': RevenueTrends,
  'instructor-recent-activity': InstructorRecentActivity,
  'instructor-course-performance': InstructorCoursePerformance,
  // Student
  'student-stats': StatsSection,
  'student-courses': StudentCoursesSection,
  'Notifications':Notifications,
};

export const DASHBOARD_CONFIG = {
  admin: {
    title: 'Platform Overview',
    propsMap: (dashboardData) => ({
      'admin-stats': { data: dashboardData?.stats },
      'admin-revenue-chart': { data: dashboardData?.revenueChart },
      'admin-recent-activity': { data: dashboardData?.recentActivity },
      'admin-course-performance': { data: dashboardData?.coursePerformance },
      'admin-user-engagement': { data: dashboardData?.userEngagement },
      'admin-active-promotions': { data: dashboardData?.activePromotions },
      'admin-subscription-plans': { data: dashboardData?.subscriptionPlans },
      'admin-subscription-stats': { data: dashboardData?.subscriptionStats },
    }),
    sections: [
      { id: 'stats', widget: 'admin-stats', className: 'mb-8' },
      {
        id: 'main-row', type: 'grid', grid: 'grid-cols-1 lg:grid-cols-3 gap-6 mt-8',
        children: [
          { id: 'chart', widget: 'admin-revenue-chart', span: 'lg:col-span-2' },
          { id: 'activity', widget: 'admin-recent-activity' },
        ]
      },
      {
        id: 'bottom-row', type: 'grid', grid: 'grid-cols-1 lg:grid-cols-2 gap-6 mt-8',
        children: [
          { id: 'courses', widget: 'admin-course-performance' },
          { id: 'users', widget: 'admin-user-engagement' },
        ]
      },
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
  instructor: {
    title: 'Instructor Dashboard',
    propsMap: (dashboardData) => ({
      'instructor-stats': { data: dashboardData?.stats },
      'instructor-revenue-trends': { data: dashboardData?.revenueTrends },
      'instructor-recent-activity': { data: dashboardData?.recentActivity },
      'instructor-course-performance': { data: dashboardData?.coursePerformance },
    }),
    sections: [
      { id: 'stats', widget: 'instructor-stats', className: 'mb-8' },//this id has nothing to do with the actual ID ,its just a react tracking system
      {
        id: 'main-row', type: 'grid', grid: 'grid-cols-1 lg:grid-cols-3 gap-6 mt-8',
        children: [
          { id: 'revenue', widget: 'instructor-revenue-trends', span: 'lg:col-span-2' },
          { id: 'activity', widget: 'instructor-recent-activity' },
        ]
      },
      {
        id: 'bottom-row', widget: 'instructor-course-performance', className: 'mt-8' }
    ],
  },
  student: {
    title: 'My Learning Dashboard',
    propsMap: (dashboardData) => ({
      'student-stats': { data: dashboardData?.stats },
      'student-courses': { data: dashboardData?.courses, showTitle: true, title: 'My Courses' },
    }),
    sections: [
      { id: 'stats', widget: 'student-stats', className: 'mb-8' },
      { id: 'courses', widget: 'student-courses', className: 'mt-8' },
    ],
  }
};

export const getDashboardConfig = (role) => DASHBOARD_CONFIG[role] || DASHBOARD_CONFIG.student;

