// src/components/headers/DashboardHeader.jsx
import { useAuth } from '../../context/AuthContext';
import UserDropdown from '../home/Header/UserDropdown';

export default function DashboardHeader() {
  const { user, isAdmin, isInstructor } = useAuth();

  const getTitle = () => {
    if (isAdmin) return "Admin Dashboard";
    if (isInstructor) return "Instructor Dashboard";
    return "My Learning Dashboard";
  };

  const showNewCourseButton = isInstructor;

  return (
    <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-10 py-4 bg-white dark:bg-gray-900 sticky top-0 z-10">
      <div className="flex items-center gap-8 flex-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {getTitle()}
        </h2>

        {/* Search — only for Admin */}
        {isAdmin && (
          <div className="flex-1 max-w-md">
            <label className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input
                type="text"
                placeholder="Search users, courses..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* New Course Button — only for Instructor */}
        {showNewCourseButton && (
          <button className="flex items-center gap-2 px-4 h-10 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
            <span className="material-symbols-outlined">add_circle</span>
            <span>New Course</span>
          </button>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="material-symbols-outlined text-2xl">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Dropdown */}
        <UserDropdown />
      </div>
    </header>
  );
}