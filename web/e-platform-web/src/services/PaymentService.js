import { auth } from '../firebase'; // Assuming firebase.js is in src/
const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class PaymentService {
  // ====================================================================
  // ORCHESTRATED PURCHASE FLOW (recommended for course purchases)
  // These endpoints use the CoursePurchaseOrchestrator for atomic operations
  // ====================================================================

  /**
   * Initiate a course purchase (creates payment, validates course & enrollment)
   * @param {Object} purchaseData - { courseId, paymentType?, subscriptionType?, paymentMethod? }
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Payment initiation data { paymentId, amount, currency, courseId, courseTitle, status }
   */
  static async initiatePurchase(purchaseData, token) {
    // Refresh token to ensure validity
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    const freshToken = await user.getIdToken(true);

    const res = await fetch(`${API_URL}/api/v1/payment/purchase/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${freshToken}`,
      },
      body: JSON.stringify(purchaseData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to initiate purchase');
    }
    const raw = await res.json();
    // Normalize: ensure paymentId field exists
    const normalized = {
      ...raw,
      paymentId: raw.paymentId || raw.id || raw._id,
    };
    console.log('💳 [PaymentService] initiatePurchase response normalized:', normalized);
    return normalized;
  }

  /**
   * Complete a course purchase (creates transaction + enrollment after payment confirmation)
   * @param {Object} confirmationData - { paymentId, gatewayTransactionId?, paymentGateway? }
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Completion data { success, transaction, enrollment }
   */
  static async completePurchase(confirmationData, token) {
    const res = await fetch(`${API_URL}/api/v1/payment/purchase/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(confirmationData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to complete purchase');
    }
    const raw = await res.json();
    // Normalize any payment references
    if (raw.payment) {
      raw.payment = {
        ...raw.payment,
        paymentId: raw.payment.paymentId || raw.payment.id || raw.payment._id,
      };
    }
    return raw;
  }

  /**
   * Get purchase status (payment + transaction + enrollment status)
   * @param {string} paymentId - The payment ID
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Status data { payment, transaction, enrollment }
   */
  static async getPurchaseStatus(paymentId, token) {
    const res = await fetch(`${API_URL}/api/v1/payment/purchase/${paymentId}/status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to get purchase status');
    }
    return res.json();
  }

  // ====================================================================
  // DIRECT PAYMENT MODULE OPERATIONS (for admin/advanced use cases)
  // These bypass the orchestrator and work directly with the payment module
  // ====================================================================

  /**
   * Creates a new payment (direct payment module call)
   * @param {Object} paymentData - Payment data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Created payment data
   */
  static async createPayment(paymentData, token) {
    const res = await fetch(`${API_URL}/api/v1/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
    if (!res.ok) throw new Error('Failed to create payment');
    return res.json();
  }

  /**
   * Fetches payments for the authenticated user
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of user's payments
   */
  static async getUserPayments(token) {
    const res = await fetch(`${API_URL}/api/v1/payment/my-payments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user payments');
    return res.json();
  }

  /**
   * Fetches a specific payment by ID
   * @param {string} paymentId - The ID of the payment
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Payment data
   */
  static async getPaymentById(paymentId, token) {
    const res = await fetch(`${API_URL}/api/v1/payment/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch payment');
    return res.json();
  }

  /**
   * Fetches payments for a specific course
   * @param {string} courseId - The ID of the course
   * @param {string} token - Authentication token (requires admin or instructor role)
   * @returns {Promise<Array>} List of payments for the course
   */
  static async getCoursePayments(courseId, token) {
    const res = await fetch(`${API_URL}/api/v1/payment/course/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch course payments');
    return res.json();
  }

  /**
   * Fetches payments by status
   * @param {string} status - Payment status (e.g., 'pending', 'completed')
   * @param {string} token - Authentication token (requires admin role)
   * @returns {Promise<Array>} List of payments with the specified status
   */
  static async getPaymentsByStatus(status, token) {
    const res = await fetch(`${API_URL}/api/v1/payment/status/${status}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch payments by status');
    return res.json();
  }

  /**
   * Updates an existing payment
   * @param {string} paymentId - The ID of the payment to update
   * @param {Object} paymentData - Updated payment data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Updated payment data
   */
  static async updatePayment(paymentId, paymentData, token) {
    const res = await fetch(`${API_URL}/api/v1/payment/${paymentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
    if (!res.ok) throw new Error('Failed to update payment');
    return res.json();
  }

  // ====================================================================
  // STRIPE GATEWAY OPERATIONS (International payment gateway)
  // Integration using Stripe Checkout
  // ====================================================================

  /**
   * Initiate a paymee payment
   * Returns Paymee Checkout URL for payment
   * @param {Object} paymentData - { paymentId, note, firstName, lastName, email, phone }
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} { paymentId, sessionId, checkoutUrl, amount }
   */
  static async initiatePaymeePayment(paymentData, token) {
    const res = await fetch(`${API_URL}/api/v1/payment/paymee/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
    
    const responseData = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      // Check for payment gateway downtime (503 Service Unavailable)
      if (res.status === 503) {
        const error = new Error(responseData.message || 'Payment gateway temporarily unavailable');
        error.code = 'GATEWAY_DOWN';
        error.details = responseData;
        throw error;
      }
      
      throw new Error(responseData.error || 'Failed to initiate Paymee payment');
    }
    
    // Normalize: ensure paymentId field exists
    const normalized = {
      ...responseData,
      paymentId: responseData.paymentId || responseData.id || responseData._id,
    };
    console.log('💳 [PaymentService] initiateStripePayment response normalized:', normalized);
    return normalized;
  }
  /**
   * Get Stripe payment status by session ID
   * Used after Stripe Checkout completion
   * @param {string} sessionId - The Stripe session ID
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} { paymentId, status, courseId, amount }
   */
  static async getPaymeePaymentStatus(sessionId, token) {
    const res = await fetch(`${API_URL}/api/v1/payment/paymee/status/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to get paymee payment status');
    }
    const raw = await res.json();
    // Normalize: ensure paymentId field exists
    return {
      ...raw,
      paymentId: raw.paymentId || raw.id || raw._id,
    };
  }

  // ====================================================================
  // PAYMENT SIMULATION (for testing when payment gateway is unavailable)
  // ====================================================================

  /**
   * Simulate a payment (for testing purposes)
   * Creates payment, completes it, and sends email notification
   * @param {Object} data - { courseId, simulateSuccess: true/false }
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} { success, message, paymentId, transactionId?, enrollment? }
   */
  static async simulatePayment(data, token) {
    const res = await fetch(`${API_URL}/api/v1/payment/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to simulate payment');
    }
    const raw = await res.json();
    // Normalize: ensure paymentId field exists
    if (raw.payment) {
      raw.payment = {
        ...raw.payment,
        paymentId: raw.payment.paymentId || raw.payment.id || raw.payment._id,
      };
    }
    return {
      ...raw,
      paymentId: raw.paymentId || raw.id || raw._id,
    };
  }
}

export default PaymentService;
