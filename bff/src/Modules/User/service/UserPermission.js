/**
 * Permission checks for User operations
 */
import { isAdmin, isAdminOrSelf } from '../../../utils/SharedPermission.js';

export const UserPermission = {
create:(user) =>
    isAdmin(user),
delete:(user) =>
    isAdmin(user),
update:(user) => 
    isAdmin(user),
read:(user,targetId) =>
    isAdminOrSelf(user,targetId),
}


