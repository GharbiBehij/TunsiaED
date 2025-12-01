/**
 * Permission checks for Admin operations
 */
import { isAdmin } from '../../../utils/SharedPermission.js';

export const AdminPermission = {
  read: (user) => isAdmin(user),
  // All admin operations require admin role
};

