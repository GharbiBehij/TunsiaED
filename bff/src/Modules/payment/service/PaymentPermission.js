/**
 * Permission checks for Payment operations
 */
import { isAdmin, isAdminOrResourceOwner } from '../../../utils/SharedPermission.js';

export function canCreatePayment(user) {
  // Any authenticated user can create a payment
  return true;
}

export function canViewPayment(user, payment) {
  // Users can view their own payments, admins can view all
  return isAdminOrResourceOwner(user, payment);
}

export function canUpdatePayment(user) {
  // Only admins can update payments (typically for status changes)
  return isAdmin(user);
}

