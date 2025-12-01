// src/components/Notifications/NotificationBell.jsx
import { useNotifications } from '../../../../hooks/useNotifications';

export default function NotificationBell() {
  const { 
    notifications = [], 
    isLoading, 
    removeNotification, 
    markAllAsRead 
  } = useNotifications();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
        <span className="material-symbols-outlined text-2xl">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-4 border-b flex justify-between">
          <h3>Notifications ({unreadCount} unread)</h3>
          <button onClick={markAllAsRead} className="text-sm text-primary">
            Mark all as read
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map(n => (
            <div key={n.id} className="p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-700">
              <p className={!n.read ? 'font-bold' : ''}>{n.message}</p>
              <button 
                onClick={() => removeNotification(n.id)}
                className="text-red-500 text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}