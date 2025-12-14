import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessDashboard } from '../config/dashboardConfig';
import { getPrimaryDashboardPath } from '../lib/dashboardRouter';
import InstructorService from '../services/InstructorService';

/**
 * Hook to enforce dashboard access based on user role
 * Redirects to primary dashboard if user lacks access to requested dashboard
 * 
 * @param {string} requiredRole - 'admin' | 'instructor' | 'student'
 */
export function useDashboardGuard(requiredRole) {
  const { isAuthenticated, isLoading, isAdmin, isInstructor, isStudent } = useAuth();
  const navigate = useNavigate();
  const [statusChecked, setStatusChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    const user = { isAdmin, isInstructor, isStudent };

    const checkAccess = async () => {
      // Instructor-specific status check
      if (requiredRole === 'instructor' && isInstructor) {
        try {
          const res = await  InstructorService.getInstructorStatus('/api/v1/instructor/status');
          const data = await res.json();
          const { status } = data;

          if (status !== 'active') {
            // redirect or show pending/declined UI
            navigate('/instructor/status', { replace: true });
            return;
          }
        } catch (err) {
          console.error('Error fetching instructor status', err);
          navigate('/login', { replace: true });
          return;
        }
      }

      // Role-based access
      if (!canAccessDashboard(user, requiredRole)) {
        const primaryDashboard = getPrimaryDashboardPath(user);
        console.warn(`User cannot access ${requiredRole} dashboard, redirecting to ${primaryDashboard}`);
        navigate(primaryDashboard, { replace: true });
        return;
      }

      setStatusChecked(true); // access granted
    };

    checkAccess();
  }, [isAuthenticated, isLoading, isAdmin, isInstructor, isStudent, requiredRole, navigate]);

  return statusChecked;
}
