/**
 * Permission checks for PromoCode operations
 */
import { isAdmin } from '../../../utils/SharedPermission.js';

export const PromoCodePermission = {
  // Validate promo code - public (anyone can validate during checkout)
  validate: () => true,
  
  // Apply promo code - public (increment usage counter)
  apply: () => true,
  
  // Create promo code - admin only
  create: (user) => isAdmin(user),
  
  // Update promo code - admin only
  update: (user) => isAdmin(user),
  
  // Delete promo code - admin only
  delete: (user) => isAdmin(user),
  
  // List all promo codes - admin only
  listAll: (user) => isAdmin(user),
};