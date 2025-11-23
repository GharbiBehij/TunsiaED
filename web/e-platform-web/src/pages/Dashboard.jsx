// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import AdminDashboard from '../components/Dashboard/AdminDashboard';
import InstructorDashboard from '../components/Dashboard/InstructorDashboard';
import StudentDashboard from '../components/Dashboard/StudentDashboard';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, role } = useAuth();
  const navigate = useNavigate();

  // ONE PLACE FOR ALL ROLE REDIRECTS
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    // Redirect based on role
    const rolePath = {
      admin: '/dashboard/admin',
      instructor: '/dashboard/instructor',
      student: '/dashboard/student',
    }[role];

    if (rolePath && window.location.pathname === '/dashboard') {
      navigate(rolePath, { replace: true });
    }
  }, [isAuthenticated, isLoading, role, navigate]);

  // Show loading while deciding
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  // Render the correct dashboard
  return (
    <div className="min-h-screen">
      {isAdmin && <AdminDashboard />}
      {isInstructor && <InstructorDashboard />}
      {isStudent && <StudentDashboard />}
    </div>
  );
}