import { notificationService } from '../service/Notification.service.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.uid;
    const notifications = await notificationService.getNotifications(userId, req.user);
    res.json(notifications);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await notificationService.getNotificationById(notificationId, req.user);
    res.json(notification);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    if (err.message === 'Notification not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { userId, ...data } = req.body;
    const notification = await notificationService.createNotification(userId || req.user.uid, data, req.user);
    res.status(201).json(notification);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await notificationService.updateNotification(notificationId, req.body, req.user);
    res.json(notification);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    if (err.message === 'Notification not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await notificationService.deleteNotification(notificationId, req.user);
    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    if (err.message === 'Notification not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.uid;
    const count = await notificationService.markAllAsRead(userId, req.user);
    res.json({ message: `Marked ${count} notifications as read` });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const notificationController = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAllAsRead,
};

