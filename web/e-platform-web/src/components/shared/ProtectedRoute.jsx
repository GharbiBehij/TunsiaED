// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, isLoading, isAdmin, isInstructor, isStudent } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center text-2xl">Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const roleMap = { admin: isAdmin, instructor: isInstructor, student: isStudent };

  if (roles && !roles.some(role => roleMap[role])) {
    return <Navigate to="/" replace />; // fallback if role not allowed
  }

  return children;
}
