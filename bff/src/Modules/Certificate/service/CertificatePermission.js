/**
 * Permission checks for Certificate operations
 */
import { isAdmin, isAdminOrResourceOwner } from '../../../utils/SharedPermission.js';

export function canIssueCertificate(user) {
  // Any enrolled user can issue a certificate (enrollment check is done in service)
  return true;
}

export function canUpdateCertificate(user) {
  return isAdmin(user);
}

export function canRevokeCertificate(user) {
  return isAdmin(user);
}

export function canViewCertificate(user, certificate) {
  // Users can view their own certificates, admins can view all
  return isAdminOrResourceOwner(user, certificate);
}

