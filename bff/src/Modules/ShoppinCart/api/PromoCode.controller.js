// bff/src/Modules/ShoppingCart/api/PromoCode.controller.js
import { promoCodeService } from '../service/PromoCode.service.js';

export class PromoCodeController {
  /**
   * Validate promo code
   * POST /api/v1/promo-code/validate
   */
  async validatePromoCode(req, res) {
    try {
      const { code, subtotal, courseId } = req.body;

      if (!code || subtotal === undefined) {
        return res.status(400).json({ 
          error: 'Code and subtotal are required' 
        });
      }

      const result = await promoCodeService.validatePromoCode(
        code,
        subtotal,
        courseId
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ 
        valid: false,
        error: error.message 
      });
    }
  }

  /**
   * Create promo code (admin only)
   * POST /api/v1/promo-code
   */
  async createPromoCode(req, res) {
    try {
      const promoCode = await promoCodeService.createPromoCode(req.user, req.body);
      res.status(201).json(promoCode);
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get all active promo codes (admin only)
   * GET /api/v1/promo-code
   */
  async getAllPromoCodes(req, res) {
    try {
      const promoCodes = await promoCodeService.getAllActivePromoCodes(req.user);
      res.status(200).json({ promoCodes });
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Update promo code (admin only)
   * PATCH /api/v1/promo-code/:promoCodeId
   */
  async updatePromoCode(req, res) {
    try {
      const { promoCodeId } = req.params;
      const promoCode = await promoCodeService.updatePromoCode(
        req.user,
        promoCodeId,
        req.body
      );

      res.status(200).json(promoCode);
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Delete promo code (admin only)
   * DELETE /api/v1/promo-code/:promoCodeId
   */
  async deletePromoCode(req, res) {
    try {
      const { promoCodeId } = req.params;
      await promoCodeService.deletePromoCode(req.user, promoCodeId);

      res.status(200).json({ message: 'Promo code deleted successfully' });
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      res.status(400).json({ error: error.message });
    }
  }
}

export const promoCodeController = new PromoCodeController();
