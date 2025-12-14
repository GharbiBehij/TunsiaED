/**
 * Permission checks for User operations
 */
import { isAdmin, isAdminOrSelf } from '../../../utils/SharedPermission.js';

export const UserPermission = {
  read: (user, targetUid) => isAdminOrSelf(user, targetUid),
  update: (user, targetUid) => isAdminOrSelf(user, targetUid),
  delete: (user, targetUid) => isAdminOrSelf(user, targetUid),
  updateRole: (user) => isAdmin(user),
};


