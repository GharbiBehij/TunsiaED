// src/modules/user/mapper/User.mapper.js

/**
 * UserMapper - Converts between UserModel (API) and UserEntity (Firestore)
 */
export const UserMapper = {
  /**
   * Converts role data (string role or boolean flags) to boolean flags.
   * 
   * @param {Object} data - Data containing role information
   * @returns {{isAdmin: boolean, isInstructor: boolean, isStudent: boolean}}
   */
  getRoleFlags(data) {
    // If boolean flags provided explicitly, use them
    if (data.isAdmin === true || data.isInstructor === true || data.isStudent === true) {
      return {
        isAdmin: data.isAdmin === true,
        isInstructor: data.isInstructor === true,
        isStudent: data.isStudent === true,
      };
    }

    // If string role provided, convert to boolean flags(this is for the firestore fall back methdo)
    if (data.role) {
      return {
        isAdmin: data.role === 'admin',
        isInstructor: data.role === 'instructor',
        isStudent: data.role === 'student',
      };
    }

    // Default: student
    return {
      isAdmin: false,
      isInstructor: false,
      isStudent: true,
    };
  },

  /**
   * Converts UserModel (from API) to UserEntity (for Firestore creation)
   * 
   * @param {string} uid - Firebase UID
   * @param {import('../model/User.model.js').UserCreateModel} model - API data
   * @returns {import('../model/entity/User.entity.js').UserEntity}
   */
  toEntity(uid, model) {
    const roleFlags = this.getRoleFlags(model);
    const now = new Date();

    return {
      uid,
      email: model.email,
      name: model.name || null,
      phone: model.phone || null,
      ...roleFlags,
      birthDate: model.birthDate || null,
      birthPlace: model.birthPlace || null,
      level: model.level || null,
      bio: model.bio || null,
      hasActiveSubscription: model.hasActiveSubscription || false,
      activePlanId: model.activePlanId || null,
      subscriptionExpiresAt: model.subscriptionExpiresAt || null,
      createdAt: now,
      updatedAt: now,
    };
  },

  /**
   * Converts update data from API to Firestore format
   * 
   * @param {import('../model/User.model.js').UserUpdateModel} model - Update data from API
   * @returns {Partial<import('../model/entity/User.entity.js').UserEntity>}
   */
  toEntityUpdate(model) {
    const updates = {
      ...model,
      updatedAt: new Date(),
    };

    // If role-related fields provided, map them to boolean flags
    if (model.role || model.isAdmin !== undefined || model.isInstructor !== undefined || model.isStudent !== undefined) {
      const roleFlags = this.getRoleFlags(model);
      Object.assign(updates, roleFlags);
      delete updates.role; // Remove string role if it exists
    }

    return updates;
  },

  /**
   * Converts UserEntity (from Firestore) to UserModel (for API response)
   * 
   * @param {import('../model/entity/User.entity.js').UserEntity} entity - Firestore document data
   * @returns {import('../model/User.model.js').UserModel}
   */
  toModel(entity) {
    if (!entity) return null;

    return {
      uid: entity.uid,
      email: entity.email,
      name: entity.name,
      phone: entity.phone,
      isAdmin: entity.isAdmin || false,
      isInstructor: entity.isInstructor || false,
      isStudent: entity.isStudent || false,
      birthDate: entity.birthDate,
      birthPlace: entity.birthPlace,
      level: entity.level,
      bio: entity.bio,
      hasActiveSubscription: entity.hasActiveSubscription || false,
      activePlanId: entity.activePlanId || null,
      subscriptionExpiresAt: entity.subscriptionExpiresAt?.toDate?.()
        ? entity.subscriptionExpiresAt.toDate().toISOString()
        : entity.subscriptionExpiresAt,
      createdAt: entity.createdAt?.toDate?.() 
        ? entity.createdAt.toDate().toISOString() //To counter the js plain text / and timestamp objects for firestore 
        : entity.createdAt,
      updatedAt: entity.updatedAt?.toDate?.() 
        ? entity.updatedAt.toDate().toISOString() 
        : entity.updatedAt,
    };
  },

  /**
   * Converts array of entities to models
   * 
   * @param {Array<{...entity}>} entities - Array of Firestore user entities
   * @returns {Array<import('../model/User.model.js').UserModel>}
   */
  toModels(entities) {
    if (!Array.isArray(entities)) return [];
    return entities.map(entity => this.toModel(entity)).filter(Boolean);
  },

  /**
   * Validates create data
   * 
   * @param {import('../model/User.model.js').UserCreateModel} data 
   * @throws {Error} If validation fails
   */
  validateCreate(data) {
    if (!data.email) {
      const error = new Error('Email is required');
      error.status = 400;
      throw error;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      const error = new Error('Invalid email format');
      error.status = 400;
      throw error;
    }

    // Validate role if provided as string
    if (data.role && !['admin', 'instructor', 'student'].includes(data.role)) {
      const error = new Error('Role must be one of: admin, instructor, student');
      error.status = 400;
      throw error;
    }
  },
};
