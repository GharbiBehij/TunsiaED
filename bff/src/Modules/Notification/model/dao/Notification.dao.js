// Firestore DAO for notifications
import { db } from '../../../../config/firebase.js';

export class NotificationDao {
  async createNotification(userId, data) {
    const docData = {
      userId,
      title: data.title,
      description: data.description,
      type: data.type || 'update',
      iconType: data.iconType || 'update',
      color: data.color || 'blue',
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const ref = await db.collection('Notifications').add(docData);
    return {
      id: ref.id,
      ...docData,
    };
  }

  async getNotificationById(notificationId) {
    const snap = await db.collection('Notifications').doc(notificationId).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : null;
  }

  async getNotificationsByUser(userId) {
    const snapshot = await db
      .collection('Notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async updateNotification(notificationId, data) {
    const update = {
      updatedAt: new Date(),
    };

    if (data.read !== undefined) update.read = data.read;
    if (data.title !== undefined) update.title = data.title;
    if (data.description !== undefined) update.description = data.description;

    await db.collection('Notifications').doc(notificationId).update(update);
    const snap = await db.collection('Notifications').doc(notificationId).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : null;
  }

  async deleteNotification(notificationId) {
    await db.collection('Notifications').doc(notificationId).delete();
  }

  async markAllAsRead(userId) {
    const snapshot = await db
      .collection('Notifications')
      .where('userId', '==', userId)
      .where('read', '==', false)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true, updatedAt: new Date() });
    });
    await batch.commit();
    return snapshot.size;
  }
}

export const notificationDao = new NotificationDao();

