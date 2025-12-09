// Dashboard routing utility - Maps role booleans to dashboard paths
// Keeps dashboard URLs consistent across the app
import { getPrimaryDashboardRole } from '../config/dashboardConfig';

/**
 * Get primary dashboard path for a user based on role booleans
 * Priority: Admin > Instructor > Student
 * @param {Object} user - { isAdmin, isInstructor, isStudent }
 * @returns {string} Dashboard path
 */
export function getPrimaryDashboardPath(user) {
  if (!user) return '/login';
  
  const role = getPrimaryDashboardRole(user);
  if (role) return `/dashboard/${role}`;
  
  // Fallback for users without roles
  return '/';
}

/**
 * Get dashboard title based on role booleans
 * Uses titles from dashboardConfig for consistency
 * @param {Object} user - { isAdmin, isInstructor, isStudent }
 * @returns {string} Dashboard title
 */
export function getDashboardTitle(user) {
  if (!user) return 'Dashboard';
  
  const role = getPrimaryDashboardRole(user);
  if (!role) return 'Dashboard';
  
  // Map to user-friendly titles
  const titleMap = {
    admin: 'Admin Dashboard',
    instructor: 'Instructor Dashboard',
    student: 'My Learning Dashboard'
  };
  
  return titleMap[role] || 'Dashboard';
}

/**
 * Check if user can access a specific dashboard
 * Re-exported from dashboardConfig for convenience
 * @param {Object} user - { isAdmin, isInstructor, isStudent }
 * @param {string} role - 'admin' | 'instructor' | 'student'
 * @returns {boolean}
 */
export { canAccessDashboard } from '../config/dashboardConfig';
