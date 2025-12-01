import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware.js';
import { notificationController } from './Notification.controller.js';

const router = Router();

router.get('/', authenticate, notificationController.getNotifications);
router.get('/:notificationId', authenticate, notificationController.getNotificationById);
router.post('/', authenticate, notificationController.createNotification);
router.patch('/:notificationId', authenticate, notificationController.updateNotification);
router.delete('/:notificationId', authenticate, notificationController.deleteNotification);
router.patch('/mark-all-read', authenticate, notificationController.markAllAsRead);

export { router };

