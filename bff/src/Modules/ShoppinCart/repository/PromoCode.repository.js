// bff/src/Modules/ShoppingCart/repository/PromoCode.repository.js
// Repository abstracts DAO operations and provides business-focused methods
import { promoCodeDao } from '../model/dao/PromoCode.dao.js';

export const promoCodeRepository = {
  /**
   * Find promo code by code string
   * @param {string} code - Promo code string
   * @returns {Object|null} Promo code data
   */
  async findByCode(code) {
    return promoCodeDao.findByCode(code);
  },

  /**
   * Find promo code by ID
   * @param {string} promoCodeId - Document ID
   * @returns {Object|null} Promo code data
   */
  async findById(promoCodeId) {
    return promoCodeDao.findById(promoCodeId);
  },

  /**
   * Create new promo code
   * @param {Object} promoCodeData - Promo code data
   * @returns {Object} Created promo code
   */
  async create(promoCodeData) {
    return promoCodeDao.create(promoCodeData);
  },

  /**
   * Update promo code
   * @param {string} promoCodeId - Document ID
   * @param {Object} updateData - Fields to update
   * @returns {Object} Updated promo code
   */
  async update(promoCodeId, updateData) {
    return promoCodeDao.update(promoCodeId, updateData);
  },

  /**
   * Increment promo code usage count
   * @param {string} promoCodeId - Document ID
   */
  async incrementUsage(promoCodeId) {
    return await promoCodeDao.incrementUsage(promoCodeId);
  },

  /**
   * Get all active promo codes
   * @returns {Array} Array of active promo codes
   */
  async findAllActive() {
    return promoCodeDao.findAllActive();
  },

  /**
   * Get all promo codes (active and inactive)
   * @returns {Array} Array of all promo codes
   */
  async findAll() {
    return promoCodeDao.findAll();
  },

  /**
   * Find promo codes applicable to a specific course
   * @param {string} courseId - Course ID
   * @returns {Array} Array of applicable promo codes
   */
  async findByCourse(courseId) {
    return promoCodeDao.findByCourse(courseId);
  },

  /**
   * Delete promo code permanently
   * @param {string} promoCodeId - Document ID
   */
  async delete(promoCodeId) {
    return await promoCodeDao.delete(promoCodeId);
  },

  /**
   * Soft delete (deactivate) promo code
   * @param {string} promoCodeId - Document ID
   */
  async deactivate(promoCodeId) {
    return await promoCodeDao.deactivate(promoCodeId);
  },
};
