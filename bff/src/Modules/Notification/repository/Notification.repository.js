import { notificationDao } from '../model/dao/Notification.dao.js';
import { Notification } from '../model/entity/Notification.entity.js';

export class NotificationRepository {
  async createNotification(userId, data) {
    const raw = await notificationDao.createNotification(userId, data);
    return new Notification(
      raw.id,
      raw.userId,
      raw.title,
      raw.description,
      raw.type,
      raw.iconType,
      raw.color,
      raw.read,
      new Date(raw.createdAt),
      raw
    );
  }

  async getNotificationById(notificationId) {
    const doc = await notificationDao.getNotificationById(notificationId);
    if (!doc) return null;
    return new Notification(
      doc.id,
      doc.userId,
      doc.title,
      doc.description,
      doc.type,
      doc.iconType,
      doc.color,
      doc.read,
      new Date(doc.createdAt),
      doc
    );
  }

  async getNotificationsByUser(userId) {
    const docs = await notificationDao.getNotificationsByUser(userId);
    return docs.map(doc =>
      new Notification(
        doc.id,
        doc.userId,
        doc.title,
        doc.description,
        doc.type,
        doc.iconType,
        doc.color,
        doc.read,
        new Date(doc.createdAt),
        doc
      )
    );
  }

  async updateNotification(notificationId, data) {
    const doc = await notificationDao.updateNotification(notificationId, data);
    if (!doc) return null;
    return new Notification(
      doc.id,
      doc.userId,
      doc.title,
      doc.description,
      doc.type,
      doc.iconType,
      doc.color,
      doc.read,
      new Date(doc.createdAt),
      doc
    );
  }

  async deleteNotification(notificationId) {
    return await notificationDao.deleteNotification(notificationId);
  }

  async markAllAsRead(userId) {
    return await notificationDao.markAllAsRead(userId);
  }
}

export const notificationRepository = new NotificationRepository();

