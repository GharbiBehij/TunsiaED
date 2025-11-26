/**
 * Permission checks for Transaction operations
 */
import { isAdmin, isResourceOwner, isAdminOrResourceOwner } from '../../../utils/SharedPermission.js';

export function canCreateTransaction(user, payment) {
  // Users can create transactions for their own payments
  return isResourceOwner(user, payment);
}

export function canUpdateTransaction(user) {
  // Only admins can update transactions
  return isAdmin(user);
}

export function canViewTransaction(user, transaction) {
  // Users can view their own transactions, admins can view all
  return isAdminOrResourceOwner(user, transaction);
}

