/**
 * Permission checks for Certificate operations
 */
import { isAdmin, isAdminOrResourceOwner } from '../../../utils/SharedPermission.js';

export const CertificatePermission = {
  create: user => isAdmin(user), // Any enrolled user can create/issue
  update: user => isAdmin(user),
  delete: user => isAdmin(user),
  read: (user, certificate) => isAdminOrResourceOwner(user, certificate)
};

