/**
 * Permission checks for Transaction operations
 */
import { isAdmin, isResourceOwner, isAdminOrResourceOwner } from '../../../utils/SharedPermission.js';

export const TransactionPermission = {
  create: (user, payment) => isResourceOwner(user, payment),
  update: (user) => isAdmin(user),
  delete: (user) => isAdmin(user),
  read: (user, transaction) => isAdminOrResourceOwner(user, transaction)
};

