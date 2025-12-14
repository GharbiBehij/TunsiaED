// src/modules/Cart/mapper/Cart.mapper.js

/**
 * CartMapper - Converts between CartModel (API) and CartEntity (Firestore)
 */
export const CartMapper = {
  /**
   * Converts a cart item from API format to Firestore format
   * 
   * @param {Object} item - Item data from API
   * @returns {Object} CartItemEntity
   */
  itemToEntity(item) {
    return {
      itemId: item.itemId || `cart-${item.courseId}-${Date.now()}`,
      courseId: item.courseId,
      courseTitle: item.courseTitle,
      instructorName: item.instructorName,
      price: item.price,
      thumbnailUrl: item.thumbnailUrl || null,
      addedAt: item.addedAt instanceof Date ? item.addedAt : new Date(),
    };
  },

  /**
   * Converts a cart item from Firestore format to API format
   * 
   * @param {Object} entity - CartItemEntity from Firestore
   * @returns {Object} CartItemModel
   */
  itemToModel(entity) {
    if (!entity) return null;

    return {
      itemId: entity.itemId,
      courseId: entity.courseId,
      courseTitle: entity.courseTitle,
      instructorName: entity.instructorName,
      price: entity.price,
      thumbnailUrl: entity.thumbnailUrl,
      addedAt: entity.addedAt?.toDate?.() 
        ? entity.addedAt.toDate().toISOString() 
        : entity.addedAt,
    };
  },

  /**
   * Converts CartEntity (from Firestore) to CartModel (for API response)
   * 
   * @param {string} cartId - Firestore document ID (userId)
   * @param {Object} entity - CartEntity from Firestore
   * @returns {Object} CartModel
   */
  toModel(cartId, entity) {
    if (!entity) return null;

    const items = Array.isArray(entity.items) 
      ? entity.items.map(item => this.itemToModel(item)).filter(Boolean)
      : [];

    return {
      cartId,
      userId: entity.userId,
      items,
      itemCount: items.length,
      subtotal: items.reduce((sum, item) => sum + item.price, 0),
      createdAt: entity.createdAt?.toDate?.() 
        ? entity.createdAt.toDate().toISOString() 
        : entity.createdAt,
      updatedAt: entity.updatedAt?.toDate?.() 
        ? entity.updatedAt.toDate().toISOString() 
        : entity.updatedAt,
      expiresAt: entity.expiresAt?.toDate?.() 
        ? entity.expiresAt.toDate().toISOString() 
        : entity.expiresAt || null,
    };
  },

  /**
   * Creates a new CartEntity for Firestore (initial creation)
   * 
   * @param {string} userId - User ID
   * @param {Array} items - Initial items (optional)
   * @returns {Object} CartEntity
   */
  toEntity(userId, items = []) {
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

    const cartItems = items.map(item => this.itemToEntity(item));
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    return {
      userId,
      items: cartItems,
      itemCount: cartItems.length,
      subtotal,
      createdAt: now,
      updatedAt: now,
      expiresAt,
    };
  },

  /**
   * Creates update data for adding/removing items
   * 
   * @param {Array} items - Updated items array
   * @returns {Object} Partial CartEntity for update
   */
  toEntityUpdate(items) {
    const cartItems = items.map(item => this.itemToEntity(item));
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    return {
      items: cartItems,
      itemCount: cartItems.length,
      subtotal,
      updatedAt: new Date(),
    };
  },

  /**
   * Validates add-to-cart data
   * 
   * @param {Object} data - AddToCartModel
   * @throws {Error} If validation fails
   */
  validateAddToCart(data) {
    const requiredFields = ['userId', 'courseId', 'courseTitle', 'instructorName', 'price'];
    
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        const error = new Error(`${field} is required`);
        error.status = 400;
        throw error;
      }
    }

    if (typeof data.price !== 'number' || data.price < 0) {
      const error = new Error('Price must be a non-negative number');
      error.status = 400;
      throw error;
    }
  },

  /**
   * Validates remove-from-cart data
   * 
   * @param {Object} data - RemoveFromCartModel
   * @throws {Error} If validation fails
   */
  validateRemoveFromCart(data) {
    const requiredFields = ['userId', 'itemId'];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        const error = new Error(`${field} is required`);
        error.status = 400;
        throw error;
      }
    }
  },

  /**
   * Converts localStorage cart item to API format
   * Used during cart sync when user logs in
   * 
   * @param {Object} localItem - Item from localStorage
   * @returns {Object} Normalized item for adding to cart
   */
  fromLocalStorageItem(localItem) {
    return {
      courseId: localItem.courseId,
      courseTitle: localItem.title,
      instructorName: localItem.instructor,
      price: localItem.price,
      thumbnailUrl: localItem.thumbnailUrl || null,
    };
  },
};
