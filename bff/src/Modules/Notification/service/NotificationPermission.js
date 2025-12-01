import { isAdminOrResourceOwner } from '../../../utils/SharedPermission.js';

export const NotificationPermission = {
  create: user => true,
  read: (user, notification) => isAdminOrResourceOwner(user, notification),
  update: (user, notification) => isAdminOrResourceOwner(user, notification),
  delete: (user, notification) => isAdminOrResourceOwner(user, notification),
};

