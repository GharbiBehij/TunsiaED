/**
 * Permission checks for Payment operations
 */
import { isAdmin, isAdminOrResourceOwner } from '../../../utils/SharedPermission.js';

export const PaymentPermission = {
  create: (user) => true,
  update: (user) => isAdmin(user),
  delete: (user) => isAdmin(user),
  read: (user, payment) => isAdminOrResourceOwner(user, payment)
};

