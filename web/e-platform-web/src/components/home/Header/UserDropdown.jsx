// src/components/Header/UserDropdown.jsx
import { useAuth } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useLogout';
import { useNavigate } from 'react-router-dom';

export default function UserDropdown({ isOpen, onToggle, onClose }) {
  const { user,logout } = useAuth();
 
  const navigate = useNavigate();

  // Get first letter(s) of name/email for the avatar
  const displayName = user?.profile?.name || user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Random but consistent color based on user ID (like Google)
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  const avatarColor = stringToColor(user?.uid || displayName);

  return (
    <div className="relative">
      {/* Avatar + Name Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-3 hover:ring-4 hover:ring-primary/20 transition rounded-full focus:outline-none"
      >
        {/* GOOGLE-STYLE GENERIC AVATAR */}
        <div
          className="size-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white/50"
          style={{ backgroundColor: avatarColor }}
          title={displayName}
        >
          {initials}
        </div>

        <span className="hidden sm:block text-sm font-medium text-text-light dark:text-text-dark">
          {displayName}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-neutral-light/20 dark:border-neutral-dark/20 overflow-hidden z-50">
          <div className="py-2">
            <button
              onClick={() => { navigate('/dashboard'); onClose(); }}
              className="w-full px-5 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3"
            >
              Dashboard
            </button>

            <button
              onClick={() => { navigate('/profile'); onClose(); }}
              className="w-full px-5 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3"
            >
              Profile & Settings
            </button>

            <hr className="my-2 border-neutral-light/20 dark:border-neutral-dark/20" />

            <button
              onClick={logout}
              className="w-full px-5 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-3"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}