// bff/src/Modules/ShoppingCart/model/dao/PromoCode.dao.js
// DAO handles raw Firestore operations
import { db } from '../../../../config/firebase.js'; 

const COLLECTION = 'PromoCodes';

export class PromoCodeDao {
  get collection() {
    return db.collection(COLLECTION);
  }

  /**
   * Find promo code by code string
   * @param {string} code - Promo code string
   * @returns {Object|null} Promo code document with id
   */
  async findByCode(code) {
    const snapshot = await this.collection
      .where('code', '==', code.toUpperCase())
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  /**
   * Find promo code by document ID
   * @param {string} promoCodeId - Document ID
   * @returns {Object|null} Promo code document with id
   */
  async findById(promoCodeId) {
    const doc = await this.collection.doc(promoCodeId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  /**
   * Create new promo code
   * @param {Object} promoCodeData - Promo code data
   * @returns {Object} Created promo code with id
   */
  async create(promoCodeData) {
    const docRef = await this.collection.add({
      ...promoCodeData,
      code: promoCodeData.code.toUpperCase(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  /**
   * Update promo code
   * @param {string} promoCodeId - Document ID
   * @param {Object} updateData - Fields to update
   * @returns {Object} Updated promo code with id
   */
  async update(promoCodeId, updateData) {
    const docRef = this.collection.doc(promoCodeId);
    
    await docRef.update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  /**
   * Increment usage count atomically
   * @param {string} promoCodeId - Document ID
   */
  async incrementUsage(promoCodeId) {
    await this.collection.doc(promoCodeId).update({
      usedCount: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  /**
   * Get all active promo codes
   * @returns {Array} Array of active promo codes
   */
  async findAllActive() {
    const snapshot = await this.collection
      .where('isActive', '==', true)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Get all promo codes (active and inactive)
   * @returns {Array} Array of all promo codes
   */
  async findAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Find promo codes by course ID
   * @param {string} courseId - Course ID
   * @returns {Array} Array of promo codes applicable to course
   */
  async findByCourse(courseId) {
    const snapshot = await this.collection
      .where('applicableCourses', 'array-contains', courseId)
      .where('isActive', '==', true)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Delete promo code
   * @param {string} promoCodeId - Document ID
   */
  async delete(promoCodeId) {
    await this.collection.doc(promoCodeId).delete();
    return { message: 'Promo code deleted successfully' };
  }

  /**
   * Soft delete (deactivate) promo code
   * @param {string} promoCodeId - Document ID
   */
  async deactivate(promoCodeId) {
    await this.collection.doc(promoCodeId).update({
      isActive: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

export const promoCodeDao = new PromoCodeDao();
