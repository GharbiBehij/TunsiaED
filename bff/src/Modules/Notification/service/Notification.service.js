import { notificationRepository } from '../repository/Notification.repository.js';
import { NotificationPermission } from './NotificationPermission.js';

export class NotificationService {
  async getNotifications(userId, user) {
    if (!NotificationPermission.read(user, { userId })) {
      throw new Error('Unauthorized');
    }
    return await notificationRepository.getNotificationsByUser(userId);
  }

  async getNotificationById(notificationId, user) {
    const notification = await notificationRepository.getNotificationById(notificationId);
    if (!notification) throw new Error('Notification not found');
    if (!NotificationPermission.read(user, notification)) {
      throw new Error('Unauthorized');
    }
    return notification;
  }

  async createNotification(userId, data, user) {
    if (!NotificationPermission.create(user)) {
      throw new Error('Unauthorized');
    }
    return await notificationRepository.createNotification(userId, data);
  }

  async updateNotification(notificationId, data, user) {
    const notification = await notificationRepository.getNotificationById(notificationId);
    if (!notification) throw new Error('Notification not found');
    if (!NotificationPermission.update(user, notification)) {
      throw new Error('Unauthorized');
    }
    return await notificationRepository.updateNotification(notificationId, data);
  }

  async deleteNotification(notificationId, user) {
    const notification = await notificationRepository.getNotificationById(notificationId);
    if (!notification) throw new Error('Notification not found');
    if (!NotificationPermission.delete(user, notification)) {
      throw new Error('Unauthorized');
    }
    return await notificationRepository.deleteNotification(notificationId);
  }

  async markAllAsRead(userId, user) {
    if (!NotificationPermission.read(user, { userId })) {
      throw new Error('Unauthorized');
    }
    return await notificationRepository.markAllAsRead(userId);
  }
}

export const notificationService = new NotificationService();

