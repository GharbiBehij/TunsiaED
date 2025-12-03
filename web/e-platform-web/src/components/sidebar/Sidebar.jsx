// src/components/Sidebar/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarItem from './SidebarItem';

const SIDEBAR_CONFIG = {
  admin: [
    { label: "Dashboard", icon: "dashboard", path: "/pages/Admin/AdminDashboard" }, // Adjusted path for consistency with App.jsx
    { label: "Users", icon: "group", path: "/dashboard/users" },
    { label: "Courses", icon: "school", path: "/dashboard/courses" },
    { label: "Payments", icon: "payments", path: "/dashboard/payments" },
    { label: "Instructors", icon: "verified_user", path: "/dashboard/instructors" },
    { label: "Subscriptions", icon: "card_membership", path: "/dashboard/subscriptions" },
  ],
  instructor: [
    { label: "My Classes", icon: "video_library", path: "/pages/Instructor/InstructorDashboard" }, // Adjusted path for consistency with App.jsx
    { label: "Students", icon: "people", path: "/dashboard/instructor/students" },
    { label: "Earnings", icon: "trending_up", path: "/dashboard/instructor/earnings" },
    { label: "Create Course", icon: "add_box", path: "/dashboard/instructor/create" },
  ],
  student: [
    { label: "My Courses", icon: "school", path: "/pages/Student/StudentDashboard" }, // Adjusted path for consistency with App.jsx
    { label: "Progress", icon: "bar_chart", path: "/dashboard/student/progress" },
    { label: "Certificates", icon: "award", path: "/dashboard/student/certificates" },
    { label: "Browse Courses", icon: "search", path: "/Course" }, // Adjusted path for consistency with App.jsx
  ],
};

export default function Sidebar() {
  // Destructure 'logout' from useAuth, and initialize 'navigate'
  const { isAdmin, isInstructor, isStudent, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (isLoading) {
    return (
      <aside className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-6">Loading...</div>
      </aside>
    );
  }

  // Determine the role and corresponding sidebar items
  let role = 'student'; // Default to student if no specific role is found (or unauthenticated, though this component should be protected)
  if (isAdmin) {
    role = 'admin';
  } else if (isInstructor) {
    role = 'instructor';
  } else if (isStudent) {
    role = 'student';
  }
  
  const items = SIDEBAR_CONFIG[role];

  return (
    <aside className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="text-primary">
            {/* SVG from Logo.jsx for consistency */}
            <svg className="size-8" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">TunisiaED</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role} Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {items.map((item) => (
            <SidebarItem key={item.path} {...item} />
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button 
          onClick={handleLogout} // Attach the handler
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
