// src/components/Sidebar/SidebarItem.jsx
import { Link, useLocation } from 'react-router-dom';

export default function SidebarItem({ label, icon, path }) {
  const location = useLocation();
  const isActive = location.pathname === path || location.pathname.startsWith(path);

  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
        isActive
          ? 'bg-gradient-to-r from-primary to-blue-600 text-white font-semibold shadow-lg shadow-primary/30 scale-105'
          : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700/50 hover:shadow-md hover:scale-102 hover:translate-x-1'
      }`}
    >
      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
      )}
      
      <span className={`material-symbols-outlined text-xl transition-transform duration-300 ${
        isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'
      }`}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      
      {/* Hover effect shimmer */}
      {!isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      )}
    </Link>
  );
}