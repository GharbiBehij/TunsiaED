// bff/src/Modules/User/service/User.service.js
import { userRepository } from '../repository/User.repository.js';
import { UserPermission } from './UserPermission.js';
import { UserRoleService } from './UserRoleService.js';
import { UserMapper } from '../mapper/User.mapper.js';
import { cacheClient } from '../../../core/cache/cacheClient.js';

export class UserService {
  // Helper: Map raw data to model
  _toModel(raw) {
    return raw ? UserMapper.toModel(raw) : null;
  }

  _toModels(rawList) {
    return rawList.map(raw => UserMapper.toModel(raw)).filter(Boolean);
  }

  _toEntity(uid, model) {
    return UserMapper.toEntity(uid, model);
  }

  _toEntityUpdate(model) {
    return UserMapper.toEntityUpdate(model);
  }

  // Create new user profile with role assignment (public - during registration)
  async onboardUser(user, parsedData) {
    const { uid, email } = user;

    UserMapper.validateCreate({ email, ...parsedData });

    // Set Firebase Custom Claims (this makes roles appear in the JWT token)
    const roleFlags = await UserRoleService.setRolesOnOnboard(
      uid,
      email,
      parsedData.role
    );

    // Store in Firestore (for queries and backward compatibility)
    const raw = await userRepository.onboard(uid, {
      email,
      ...roleFlags,
      ...parsedData,
    });
    return this._toModel(raw);
  }

  // Get user profile by UID (admin/self only)
  async getProfile(uid) {
    const cacheKey = `user_profile_${uid}`;
    
    // Check cache first
    const cached = await cacheClient.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    const raw = await userRepository.findByUid(uid);
    const profile = this._toModel(raw);
    
    // Cache for 10 minutes (subscription status doesn't change frequently)
    if (profile) {
      await cacheClient.set(cacheKey, profile, 600);
    }
    
    return profile;
  }

  // Update user profile (admin/self only, role changes admin only)
  async updateProfile(targetUserId, actor, updates) {
    if (!UserPermission.update(actor, targetUserId)) {
      throw new Error('Unauthorized');
    }

    // Check if updating role fields
    const containsRoleChanges =
      updates.role ||
      updates.isAdmin !== undefined ||
      updates.isInstructor !== undefined ||
      updates.isStudent !== undefined;

    if (containsRoleChanges) {
      if (!UserPermission.updateRole(actor)) {
        throw new Error("Unauthorized: Only admins can change roles");
      }

      // Sync role changes to Firebase Custom Claims
      if (updates.isAdmin === true) {
        await UserRoleService.setAdmin(targetUserId);
      } else if (updates.isInstructor === true) {
        await UserRoleService.setInstructor(targetUserId);
      } else if (updates.isStudent === true || updates.role === 'student') {
        await UserRoleService.setStudent(targetUserId);
      } else if (updates.role === 'instructor') {
        await UserRoleService.setInstructor(targetUserId);
      } else if (updates.role === 'admin') {
        await UserRoleService.setAdmin(targetUserId);
      }
    }

    const raw = await userRepository.updateProfile(targetUserId, updates);
    
    // Invalidate user profile cache
    await cacheClient.del(`user_profile_${targetUserId}`);
    
    return this._toModel(raw);
  }

  // Delete user profile (admin/self only)
  async deleteProfile(targetUserId, actor) {
    if (!UserPermission.delete(actor, targetUserId)) {
      throw new Error('Unauthorized');
    }

    return await userRepository.deleteProfile(targetUserId);
  }

  // ====================================================================
  // INTERNAL METHODS (for orchestrator use - no permission checks)
  // ====================================================================

  /**
   * Get user by UID (internal - bypasses permission for orchestrator)
   * @param {string} uid
   */
  async getUserByUidInternal(uid) {
    const raw = await userRepository.findByUid(uid);
    return this._toModel(raw);
  }

  /**
   * Get multiple users by UIDs (internal - bypasses permission for orchestrator)
   * @param {string[]} uids
   */
  async getUsersByUidsInternal(uids) {
    const results = await Promise.all(
      uids.map(uid => userRepository.findByUid(uid).catch(() => null))
    );
    return results.filter(Boolean).map(raw => this._toModel(raw));
  }

  /**
   * Update user subscription status (internal - for orchestrator use)
   * @param {string} uid - User ID
   * @param {Object} subscriptionData - Subscription data
   * @param {boolean} subscriptionData.hasActiveSubscription - Active subscription flag
   * @param {string|null} subscriptionData.activePlanId - Plan ID
   * @param {Date|null} subscriptionData.subscriptionExpiresAt - Expiration date
   */
  async updateSubscriptionStatusInternal(uid, subscriptionData) {
    const raw = await userRepository.updateProfile(uid, {
      hasActiveSubscription: subscriptionData.hasActiveSubscription,
      activePlanId: subscriptionData.activePlanId || null,
      subscriptionExpiresAt: subscriptionData.subscriptionExpiresAt || null,
    });
    
    // Invalidate caches related to this user
    await Promise.all([
      cacheClient.del(`user_profile_${uid}`),
      cacheClient.del(`student_dashboard_${uid}`),
      cacheClient.del(`student_learning_overview_${uid}`),
    ]);
    
    return this._toModel(raw);
  }
}

export const userService = new UserService();
