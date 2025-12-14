// src/components/shared/SubscriptionProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * SubscriptionProtectedRoute - Requires active subscription for access
 * Used for premium system courses that require subscription
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if authorized
 * @param {string} props.fallbackPath - Where to redirect if no subscription (default: /subscription)
 */
export default function SubscriptionProtectedRoute({ children, fallbackPath = '/subscription' }) {
  const { isAuthenticated, isLoading, hasActiveSubscription, isAdmin } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  // Admins always have access
  if (isAdmin) {
    return children;
  }

  // Check subscription status
  if (!hasActiveSubscription) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ 
          message: 'This content requires an active subscription. Choose a plan to continue.',
          from: window.location.pathname 
        }} 
        replace 
      />
    );
  }

  // User has active subscription
  return children;
}
