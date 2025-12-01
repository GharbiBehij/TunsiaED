// src/hooks/useRoleRedirect.js
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useRoleRedirect = () => {
  const { isAuthenticated, isLoading, isAdmin, isInstructor, isStudent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (window.location.pathname === '/dashboard') {
      if (isAdmin) navigate('/dashboard/admin', { replace: true });
      else if (isInstructor) navigate('/dashboard/instructor', { replace: true });
      else if (isStudent) navigate('/dashboard/student', { replace: true });
      else navigate('/dashboard/student', { replace: true }); // default
    }
  }, [isAuthenticated, isLoading, isAdmin, isInstructor, isStudent, navigate]);
};