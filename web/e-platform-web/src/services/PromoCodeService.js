// src/services/PromoCodeService.js
const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class PromoCodeService {
  /**
   * Validate promo code
   * @param {string} code - Promo code to validate
   * @param {number} subtotal - Cart subtotal
   * @param {string} courseId - Optional course ID for course-specific promos
   * @returns {Promise<Object>} Validation result { valid, discount, discountType, discountValue }
   */
  static async validatePromoCode(code, subtotal, courseId = null) {
    const res = await fetch(`${API_URL}/api/v1/promo-code/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, subtotal, courseId }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to validate promo code');
    }

    return res.json();
  }

  /**
   * Create promo code (admin only)
   * @param {string} token - Auth token
   * @param {Object} data - Promo code data
   * @returns {Promise<Object>} Created promo code
   */
  static async createPromoCode(token, data) {
    const res = await fetch(`${API_URL}/api/v1/promo-code`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to create promo code');
    return res.json();
  }

  /**
   * Get all promo codes (admin only)
   * @param {string} token - Auth token
   * @returns {Promise<Object>} { promoCodes: Array }
   */
  static async getAllPromoCodes(token) {
    const res = await fetch(`${API_URL}/api/v1/promo-code`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch promo codes');
    return res.json();
  }

  /**
   * Update promo code (admin only)
   * @param {string} token - Auth token
   * @param {string} promoCodeId - Promo code ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated promo code
   */
  static async updatePromoCode(token, promoCodeId, updateData) {
    const res = await fetch(`${API_URL}/api/v1/promo-code/${promoCodeId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) throw new Error('Failed to update promo code');
    return res.json();
  }

  /**
   * Delete promo code (admin only)
   * @param {string} token - Auth token
   * @param {string} promoCodeId - Promo code ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  static async deletePromoCode(token, promoCodeId) {
    const res = await fetch(`${API_URL}/api/v1/promo-code/${promoCodeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to delete promo code');
    return res.json();
  }
}

export default PromoCodeService;
