const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const getNotifications = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/v1/notification`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
};

export const removeNotification = async (notificationId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/v1/notification/${notificationId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to remove notification');
  return res.json();
};

export const markAllAsRead = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/v1/notification/mark-all-read`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to mark all as read');
  return res.json();
};

