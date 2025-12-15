// bff/src/utils/FirebaseUserMapper.js
// Utility to map Firebase Auth user data to safe DTO for client consumption

/**
 * Maps raw Firebase Auth user object to a safe DTO
 * Only includes non-sensitive fields: uid, email, emailVerified, and parsed roles
 * @param {Object} rawUser - Raw Firebase Auth user object from auth.getUser() or REST API
 * @returns {Object} Safe user DTO
 */
export const mapFirebaseUserToSafeUser = (rawUser) => {
  // Handle both Firebase Admin SDK (customClaims) and REST API (customAttributes) formats
  let roles;
  if (rawUser.customClaims) {
    // Firebase Admin SDK format
    roles = {
      isAdmin: rawUser.customClaims.isAdmin || false,
      isInstructor: rawUser.customClaims.isInstructor || false,
      isStudent: rawUser.customClaims.isStudent || false,
    };
  } else if (rawUser.customAttributes) {
    // Firebase REST API format (string that needs parsing)
    roles = typeof rawUser.customAttributes === 'string'
      ? JSON.parse(rawUser.customAttributes)
      : rawUser.customAttributes;
  } else {
    // Default roles
    roles = { isAdmin: false, isInstructor: false, isStudent: true };
  }

  // Return only safe fields
  return {
    uid: rawUser.localId || rawUser.uid,
    email: rawUser.email,
    emailVerified: rawUser.emailVerified,
    roles: roles,
  };
};