const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

class CertificateService {
  // ====================================================================
  // DIRECT SERVICE ENDPOINTS (single module operations)
  // These call the Certificate module directly without orchestration
  // ====================================================================

  /**
   * Issue a certificate (direct)
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @param {Object} data - { courseId, studentId? }
   * @returns {Promise<Object>} Created certificate
   */
  static async issueCertificate(token, data) {
    const res = await fetch(`${API_URL}/api/v1/certificate`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to issue certificate');
    return res.json();
  }

  /**
   * Fetches current user's certificates
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of user's certificates
   */
  static async getMyCertificates(token) {
    const res = await fetch(`${API_URL}/api/v1/certificate/me`, { 
      headers: getAuthHeaders(token) 
    });
    if (!res.ok) throw new Error('Failed to fetch certificates');
    return res.json();
  }

  /**
   * Fetches a specific certificate by ID
   * DIRECT: Requires authentication (ownership verified)
   * @param {string} token - Authentication token
   * @param {string} certificateId - The certificate ID
   * @returns {Promise<Object>} Certificate data
   */
  static async getCertificateById(token, certificateId) {
    const res = await fetch(`${API_URL}/api/v1/certificate/${certificateId}`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to fetch certificate');
    return res.json();
  }

  /**
   * Fetches certificates for a specific course
   * DIRECT: Requires admin or instructor role
   * @param {string} token - Authentication token
   * @param {string} courseId - The course ID
   * @returns {Promise<Array>} List of certificates for the course
   */
  static async getCourseCertificates(token, courseId) {
    const res = await fetch(`${API_URL}/api/v1/certificate/course/${courseId}`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to fetch course certificates');
    return res.json();
  }

  /**
   * Fetches all certificates (admin)
   * DIRECT: Requires admin role
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of all certificates
   */
  static async getAllCertificates(token) {
    const res = await fetch(`${API_URL}/api/v1/certificate`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to fetch all certificates');
    return res.json();
  }

  /**
   * Updates a certificate (admin only)
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @param {string} certificateId - The certificate ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated certificate
   */
  static async updateCertificate(token, certificateId, data) {
    const res = await fetch(`${API_URL}/api/v1/certificate/${certificateId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update certificate');
    return res.json();
  }

  /**
   * Revokes a certificate (admin only)
   * DIRECT: Single module operation
   * @param {string} token - Authentication token
   * @param {string} certificateId - The certificate ID
   * @returns {Promise<Object>} Deletion result
   */
  static async revokeCertificate(token, certificateId) {
    const res = await fetch(`${API_URL}/api/v1/certificate/${certificateId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to revoke certificate');
    return res.json();
  }

  // ====================================================================
  // ORCHESTRATED ENDPOINTS (cross-module operations)
  // These use CertificateGrantingOrchestrator for validation + issuance
  // ====================================================================

  /**
   * Grant certificate with completion validation
   * ORCHESTRATOR: Validates course completion then issues certificate
   * Cross-module: Certificate + Progress + Enrollment + Course modules
   * @param {string} token - Authentication token
   * @param {Object} data - { courseId }
   * @returns {Promise<Object>} { certificate, completionDetails }
   */
  static async grantCertificate(token, data) {
    const res = await fetch(`${API_URL}/api/v1/certificate/grant`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to grant certificate');
    }
    return res.json();
  }

  /**
   * Check eligibility for certificate
   * ORCHESTRATOR: Checks if student has completed required course content
   * Cross-module: Certificate + Progress + Enrollment modules
   * @param {string} token - Authentication token
   * @param {string} courseId - The course ID
   * @returns {Promise<Object>} { eligible, progress, requirements }
   */
  static async checkEligibility(token, courseId) {
    const res = await fetch(`${API_URL}/api/v1/certificate/eligibility/${courseId}`, { 
      headers: getAuthHeaders(token) 
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to check eligibility');
    }
    return res.json();
  }

  /**
   * Auto-grant certificates for completed courses (admin only)
   * ORCHESTRATOR: Batch process to grant certificates to all eligible students
   * Cross-module: Certificate + Progress + Enrollment + User modules
   * @param {string} token - Authentication token
   * @param {Object} [options] - { courseId?: string, dryRun?: boolean }
   * @returns {Promise<Object>} { granted: Array, skipped: Array, errors: Array }
   */
  static async autoGrantCertificates(token, options = {}) {
    const res = await fetch(`${API_URL}/api/v1/certificate/auto-grant`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(options),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to auto-grant certificates');
    }
    return res.json();
  }
}

export default CertificateService;
