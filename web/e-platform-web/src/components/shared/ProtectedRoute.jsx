// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useInstructorStatus } from '../../hooks';
import { getPrimaryDashboardPath } from '../../lib/dashboardRouter';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, isLoading, isAdmin, isInstructor, isStudent } = useAuth();
  const { data: statusData, isLoading: statusLoading } = useInstructorStatus();

  if (isLoading || statusLoading) return <div className="flex h-screen items-center justify-center text-2xl">Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const roleMap = { admin: isAdmin, instructor: isInstructor, student: isStudent };

  // If roles specified, check user has at least one required role
  if (roles && !roles.some(role => roleMap[role])) {
    // Redirect to user's primary dashboard instead of homepage
    const redirectPath = getPrimaryDashboardPath({ isAdmin, isInstructor, isStudent });
    return <Navigate to={redirectPath} replace />;
  }

  if (isInstructor) {
    if (statusData && statusData.status !== 'active') {
      return <Navigate to="/instructor/status" replace />;
    }
  }

  return children;
}
