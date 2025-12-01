// src/components/Sidebar/SidebarItem.jsx
import { Link, useLocation } from 'react-router-dom';

export default function SidebarItem({ label, icon, path }) {
  const location = useLocation();
  const isActive = location.pathname === path || location.pathname.startsWith(path);

  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        isActive
          ? 'bg-primary/10 text-primary font-semibold'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}