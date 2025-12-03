// Paymee Payment Gateway Adapter
// Tunisian payment gateway integration (https://www.paymee.tn)
// Isolates Paymee API from business logic

import axios from 'axios';

const PAYMEE_API_URL = process.env.PAYMEE_API_URL || 'https://app.paymee.tn/api/v2';
const PAYMEE_TOKEN = process.env.PAYMEE_TOKEN;

/**
 * Paymee Gateway Adapter
 * Handles all Paymee API interactions
 */
export const PaymeeAdapter = {
  /**
   * Initiate payment
   * @param {Object} paymentData - Payment information
   * @param {string} paymentData.amount - Amount in millimes
   * @param {string} paymentData.orderId - Internal order/payment ID
   * @param {string} paymentData.firstName - Customer first name
   * @param {string} paymentData.lastName - Customer last name
   * @param {string} paymentData.email - Customer email
   * @param {string} paymentData.phone - Customer phone
   * @param {string} paymentData.note - Payment note/description
   * @param {string} paymentData.returnUrl - Success callback URL
   * @param {string} paymentData.cancelUrl - Cancel callback URL
   * @param {string} paymentData.webhookUrl - Webhook URL for payment status
   * @returns {Promise<Object>} { token, gatewayUrl, amount, orderId }
   */
  async initiatePayment(paymentData) {
    try {
      const response = await axios.post(
        `${PAYMEE_API_URL}/payments/create`,
        {
          vendor: PAYMEE_TOKEN,
          amount: paymentData.amount,
          note: paymentData.note || 'TunisiaED Course Purchase',
          first_name: paymentData.firstName,
          last_name: paymentData.lastName,
          email: paymentData.email,
          phone: paymentData.phone,
          return_url: paymentData.returnUrl,
          cancel_url: paymentData.cancelUrl,
          webhook_url: paymentData.webhookUrl,
          order_id: paymentData.orderId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.status) {
        return {
          token: response.data.data.token,
          gatewayUrl: response.data.data.payment_url,
          amount: paymentData.amount,
          orderId: paymentData.orderId,
        };
      } else {
        throw new Error(response.data?.message || 'Paymee payment initiation failed');
      }
    } catch (error) {
      console.error('Paymee initiation error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to initiate Paymee payment'
      );
    }
  },

  /**
   * Verify payment status
   * @param {string} paymentToken - Paymee payment token
   * @returns {Promise<Object>} Payment status details
   */
  async verifyPayment(paymentToken) {
    try {
      const response = await axios.post(
        `${PAYMEE_API_URL}/payments/check`,
        {
          vendor: PAYMEE_TOKEN,
          payment_token: paymentToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.status) {
        return {
          success: true,
          status: response.data.data.payment_status,
          amount: response.data.data.amount,
          orderId: response.data.data.order_id,
          transactionId: response.data.data.transaction_id,
          paymentDate: response.data.data.payment_date,
          raw: response.data.data,
        };
      } else {
        return {
          success: false,
          status: 'failed',
          message: response.data?.message || 'Payment verification failed',
        };
      }
    } catch (error) {
      console.error('Paymee verification error:', error.response?.data || error.message);
      return {
        success: false,
        status: 'error',
        message: error.message || 'Failed to verify payment',
      };
    }
  },

  /**
   * Process webhook payload
   * @param {Object} payload - Webhook payload from Paymee
   * @returns {Object} Normalized payment status
   */
  processWebhook(payload) {
    return {
      paymentToken: payload.payment_token,
      status: payload.payment_status,
      orderId: payload.order_id,
      amount: payload.amount,
      transactionId: payload.transaction_id,
      paymentDate: payload.payment_date,
      raw: payload,
    };
  },

  /**
   * Validate webhook signature (if Paymee provides signature validation)
   * @param {Object} payload - Webhook payload
   * @param {string} signature - Webhook signature
   * @returns {boolean} Is valid
   */
  validateWebhookSignature(payload, signature) {
    // Implement signature validation if Paymee provides it
    // For now, return true (add actual validation when available)
    return true;
  },

  /**
   * Get payment statuses enum
   * @returns {Object} Payment status constants
   */
  getPaymentStatuses() {
    return {
      PENDING: 'pending',
      COMPLETED: 'completed',
      FAILED: 'failed',
      CANCELLED: 'cancelled',
      REFUNDED: 'refunded',
    };
  },
};

export default PaymeeAdapter;
