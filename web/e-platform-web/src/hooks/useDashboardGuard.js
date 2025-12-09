// Custom hook for dashboard access control
// Ensures users can only access dashboards they're authorized for

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessDashboard } from '../config/dashboardConfig';
import { getPrimaryDashboardPath } from '../lib/dashboardRouter';

/**
 * Hook to enforce dashboard access based on user role
 * Redirects to primary dashboard if user lacks access to requested dashboard
 * 
 * Usage in dashboard pages:
 * function AdminDashboard() {
 *   useDashboardGuard('admin');
 *   return <DynamicDashboard role="admin" />;
 * }
 * 
 * @param {string} requiredRole - 'admin' | 'instructor' | 'student'
 */
export function useDashboardGuard(requiredRole) {
  const { isAuthenticated, isLoading, isAdmin, isInstructor, isStudent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    const user = { isAdmin, isInstructor, isStudent };

    // Check if user can access this dashboard
    if (!canAccessDashboard(user, requiredRole)) {
      // Redirect to user's primary dashboard
      const primaryDashboard = getPrimaryDashboardPath(user);
      console.warn(`User cannot access ${requiredRole} dashboard, redirecting to ${primaryDashboard}`);
      navigate(primaryDashboard, { replace: true });
    }
  }, [isAuthenticated, isLoading, isAdmin, isInstructor, isStudent, requiredRole, navigate]);
}
