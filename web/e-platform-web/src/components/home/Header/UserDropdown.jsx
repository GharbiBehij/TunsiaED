// UserDropdown.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getPrimaryDashboardPath } from '../../../lib/dashboardRouter';

// Helper component for role-based dashboard link
function DashboardLink({ onClose }) {
  const { isAdmin, isInstructor, isStudent } = useAuth();
  
  const dashboardPath = getPrimaryDashboardPath({ isAdmin, isInstructor, isStudent });

  return (
    <Link
      to={dashboardPath}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      onClick={onClose}
    >
      <span className="material-symbols-outlined text-base" data-icon="dashboard">dashboard</span>
      My Dashboard
    </Link>
  );
}

export default function UserDropdown({ isOpen, onToggle, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get first letter(s) of name/email for the avatar (from pasted_content_4.txt)
  const displayName = user?.profile?.name || user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Random but consistent color based on user ID (like Google) (from pasted_content_4.txt)
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  const avatarColor = stringToColor(user?.uid || displayName);

  // Handle logout (from pasted_content_4.txt)
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      onClose();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Dropdown visibility classes (from previous version)
  const dropdownClasses = `absolute right-0 mt-2 w-56 origin-top-right transition-transform transition-opacity duration-150 ease-in-out bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg overflow-hidden ${
    isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
  }`;

  return (
    <div className="relative">
      {/* Profile Button (lines 104-106 of pasted_content.txt) */}
      <button className="flex items-center gap-2 rounded-full" onClick={onToggle}>
        {/* Avatar with conditional background image or initials */}
        {user?.avatarUrl ? (
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9"
            data-alt="User avatar image"
            style={{
              backgroundImage: `url("${user.avatarUrl}")`,
            }}
          ></div>
        ) : (
          <div
            className="aspect-square rounded-full size-9 flex items-center justify-center text-white font-semibold text-sm"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
        )}
      </button>

      {/* Dropdown Menu (lines 107-126 of pasted_content.txt) */}
      <div className={dropdownClasses}>
        {/* User Info */}
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.profile?.name || user?.email}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800"></div>

        {/* Links */}
        <DashboardLink onClose={onClose} />
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onClose}
        >
          <span className="material-symbols-outlined text-base" data-icon="settings">settings</span>
          Account Settings
        </Link>
        <div className="border-t border-slate-200 dark:border-slate-800"></div>
        
        {/* Logout Button (changed from Link to Button to call handleLogout) */}
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <span className="material-symbols-outlined text-base" data-icon="logout">logout</span>
          Logout
        </button>
      </div>
    </div>
  );
}
