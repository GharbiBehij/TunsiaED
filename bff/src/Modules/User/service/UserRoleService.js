import { auth } from '../../../config/firebase.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const adminUid = process.env.ADMIN_UID;
export class UserRoleService {
  static async setAdmin(adminUid) {
    await auth.setCustomUserClaims(adminUid, {
      isAdmin: true,
      isInstructor: false,
      isStudent: false,
    });
  }

  static async setInstructor(uid) {
    await auth.setCustomUserClaims(uid, {
      isAdmin: false,
      isInstructor: true,
      isStudent: false,
    });
  }

  static async setStudent(uid) {
    await auth.setCustomUserClaims(uid, {
      isAdmin: false,
      isInstructor: false,
      isStudent: true,
    });
  }

  static async getRoles(uid) {
    const user = await auth.getUser(uid);
    return {
      isAdmin: user.customClaims?.isAdmin || false,
      isInstructor: user.customClaims?.isInstructor || false,
      isStudent: user.customClaims?.isStudent || false,
    };
  }

  /**
   * Set roles based on email and requested role during onboarding
   * @param {string} uid - Firebase UID
   * @param {string} email - User email
   * @param {string} requestedRole - 'student' | 'instructor'
   */
  static async setRolesOnOnboard(uid, email, requestedRole) {
    const isAdmin = email === ADMIN_EMAIL;
    
    if (isAdmin) {
      await this.setAdmin(uid);
      return { isAdmin: true, isInstructor: false, isStudent: false };
    }
    
    if (requestedRole === 'instructor') {
      await this.setInstructor(uid);
      return { isAdmin: false, isInstructor: true, isStudent: false };
    }
    
    // Default to student
    await this.setStudent(uid);
    return { isAdmin: false, isInstructor: false, isStudent: true };
  }
}