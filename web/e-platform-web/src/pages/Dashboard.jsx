// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import AdminDashboard from '../components/Dashboard/AdminDashboard';
import InstructorDashboard from '../components/Dashboard/InstructorDashboard';
import StudentDashboard from '../components/Dashboard/StudentDashboard';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, isAdmin, isInstructor, isStudent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    // REDIRECT TO CORRECT DASHBOARD
    if (window.location.pathname === '/dashboard') {
      if (isAdmin) navigate('/dashboard/admin', { replace: true });
      else if (isInstructor) navigate('/dashboard/instructor', { replace: true });
      else if (isStudent) navigate('/dashboard/student', { replace: true });
      else navigate('/dashboard/student', { replace: true }); // fallback
    }
  }, [isAuthenticated, isLoading, isAdmin, isInstructor, isStudent, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <p className="text-2xl font-semibold text-primary">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {isAdmin && <AdminDashboard />}
      {isInstructor && <InstructorDashboard />}
      {isStudent && <StudentDashboard />}
    </div>
  );
}