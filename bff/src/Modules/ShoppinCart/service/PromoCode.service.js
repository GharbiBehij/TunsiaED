// bff/src/Modules/ShoppingCart/service/PromoCode.service.js
import { promoCodeRepository } from '../repository/PromoCode.repository.js';
import { PromoCode } from '../model/PromoCode.model.js';
import { PromoCodePermission } from './PromoCode.permission.js';

export class PromoCodeService {
  /**
   * Validate and apply promo code (public - anyone can validate)
   */
  async validatePromoCode(code, subtotal, courseId = null) {
    // Permission check (public access)
    if (!PromoCodePermission.validate()) {
      throw new Error('Unauthorized');
    }

    // Find promo code
    const promoData = await promoCodeRepository.findByCode(code);
    
    if (!promoData) {
      throw new Error('Invalid promo code');
    }

    // Create PromoCode instance
    const promo = new PromoCode(promoData);

    // Validate
    if (!promo.isValid()) {
      throw new Error('This promo code has expired or is no longer valid');
    }

    // Check course applicability
    if (courseId && !promo.canApplyToCourse(courseId)) {
      throw new Error('This promo code is not applicable to the selected course');
    }

    // Calculate discount
    try {
      const discount = promo.calculateDiscount(subtotal);
      
      return {
        valid: true,
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        discount,
        promoCodeId: promoData.id,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Apply promo code (increment usage) - public
   */
  async applyPromoCode(promoCodeId) {
    // Permission check (public access)
    if (!PromoCodePermission.apply()) {
      throw new Error('Unauthorized');
    }

    return await promoCodeRepository.incrementUsage(promoCodeId);
  }

  /**
   * Create promo code (admin only)
   */
  async createPromoCode(user, data) {
    // Permission check
    if (!PromoCodePermission.create(user)) {
      throw new Error('Unauthorized');
    }

    const promoCode = new PromoCode(data);
    return await promoCodeRepository.create({
      code: promoCode.code,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      isActive: promoCode.isActive,
      validFrom: promoCode.validFrom,
      validUntil: promoCode.validUntil,
      maxUses: promoCode.maxUses,
      usedCount: promoCode.usedCount,
      minPurchaseAmount: promoCode.minPurchaseAmount,
      applicableCourses: promoCode.applicableCourses,
    });
  }

  /**
   * Get all active promo codes (admin only)
   */
  async getAllActivePromoCodes(user) {
    // Permission check
    if (!PromoCodePermission.listAll(user)) {
      throw new Error('Unauthorized');
    }

    return await promoCodeRepository.findAllActive();
  }

  /**
   * Update promo code (admin only)
   */
  async updatePromoCode(user, promoCodeId, updateData) {
    // Permission check
    if (!PromoCodePermission.update(user)) {
      throw new Error('Unauthorized');
    }

    return await promoCodeRepository.update(promoCodeId, updateData);
  }

  /**
   * Delete promo code (admin only)
   */
  async deletePromoCode(user, promoCodeId) {
    // Permission check
    if (!PromoCodePermission.delete(user)) {
      throw new Error('Unauthorized');
    }

    await promoCodeRepository.delete(promoCodeId);
  }
}

export const promoCodeService = new PromoCodeService();
