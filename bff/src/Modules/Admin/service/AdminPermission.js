/**
 * Permission checks for Admin operations
 */
import { isAdmin } from '../../../utils/SharedPermission.js';

export const AdminPermission = {
  getStats: (user) => isAdmin(user),
  getRevenue: (user) => isAdmin(user),
  getActivity: (user) => isAdmin(user),
  getCoursePerformance: (user) => isAdmin(user),
  getUserEngagement: (user) => isAdmin(user),
  getPromotions: (user) => isAdmin(user),
  managePromotions: (user) => isAdmin(user),
  getSubscriptions: (user) => isAdmin(user),
  manageSubscriptions: (user) => isAdmin(user),
  manageUsers: (user) => isAdmin(user),
  manageCourses: (user) => isAdmin(user),
};

