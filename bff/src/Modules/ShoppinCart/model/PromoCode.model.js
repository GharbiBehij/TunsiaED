// bff/src/Modules/ShoppingCart/model/PromoCode.model.js
export class PromoCode {
  constructor({
    code,
    discountType,
    discountValue,
    isActive = true,
    validFrom,
    validUntil,
    maxUses,
    usedCount = 0,
    minPurchaseAmount = 0,
    applicableCourses = [], // Empty array = applies to all
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.code = code; // e.g., 'SUMMER2025'
    this.discountType = discountType; // 'percentage' | 'fixed'
    this.discountValue = discountValue; // e.g., 20 for 20% or 50 for 50 TND
    this.isActive = isActive;
    this.validFrom = validFrom;
    this.validUntil = validUntil;
    this.maxUses = maxUses; // null = unlimited
    this.usedCount = usedCount;
    this.minPurchaseAmount = minPurchaseAmount;
    this.applicableCourses = applicableCourses;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Validation
  isValid() {
    if (!this.isActive) return false;
    
    const now = new Date();
    if (this.validFrom && now < new Date(this.validFrom)) return false;
    if (this.validUntil && now > new Date(this.validUntil)) return false;
    
    if (this.maxUses && this.usedCount >= this.maxUses) return false;
    
    return true;
  }

  canApplyToCourse(courseId) {
    if (this.applicableCourses.length === 0) return true; // Applies to all
    return this.applicableCourses.includes(courseId);
  }

  calculateDiscount(subtotal) {
    if (subtotal < this.minPurchaseAmount) {
      throw new Error(`Minimum purchase amount is ${this.minPurchaseAmount} TND`);
    }

    if (this.discountType === 'percentage') {
      return Math.round((subtotal * this.discountValue / 100) * 100) / 100;
    } else if (this.discountType === 'fixed') {
      return Math.min(this.discountValue, subtotal);
    }
    
    return 0;
  }

  incrementUsage() {
    this.usedCount += 1;
    this.updatedAt = new Date();
  }
}
