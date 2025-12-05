// PaymeeService - Paymee Payment Gateway Integration
// Handles payment initiation, webhook verification, and status checks
// Documentation: https://www.paymee.tn/paymee-integration-without-redirection

import crypto from 'crypto';

// Paymee API Configuration
const PAYMEE_CONFIG = {
  // Sandbox URLs (switch to app.paymee.tn for production)
  SANDBOX_URL: 'https://sandbox.paymee.tn/api/v2/payments/create',
  LIVE_URL: 'https://app.paymee.tn/api/v2/payments/create',
  SANDBOX_GATEWAY: 'https://sandbox.paymee.tn/gateway',
  LIVE_GATEWAY: 'https://app.paymee.tn/gateway',
};

/**
 * PaymeeService - Service for Paymee payment gateway operations
 */
class PaymeeService {
  constructor() {
    // Get config from environment variables
    this.apiKey = process.env.PAYMEE_API_KEY;
    this.apiToken = process.env.PAYMEE_API_TOKEN; // For checksum verification
    this.isProduction = process.env.NODE_ENV === 'production';
    this.baseUrl = this.isProduction ? PAYMEE_CONFIG.LIVE_URL : PAYMEE_CONFIG.SANDBOX_URL;
    this.gatewayUrl = this.isProduction ? PAYMEE_CONFIG.LIVE_GATEWAY : PAYMEE_CONFIG.SANDBOX_GATEWAY;
    
    // Webhook URL (your BFF endpoint that receives payment status)
    this.webhookUrl = process.env.PAYMEE_WEBHOOK_URL || 'https://tunsiaed.onrender.com/api/v1/payment/paymee/webhook';
    
    // Return URLs after payment
    this.returnUrl = process.env.PAYMEE_RETURN_URL || 'https://tunsiaed.netlify.app/payment/success';
    this.cancelUrl = process.env.PAYMEE_CANCEL_URL || 'https://tunsiaed.netlify.app/payment/cancel';
  }

  /**
   * Initiate a Paymee payment
   * Step 1: Create payment and get gateway URL
   * @param {Object} paymentData - Payment details
   * @param {number} paymentData.amount - Payment amount in TND
   * @param {string} paymentData.note - Note about the payment (e.g., "Course: React Basics")
   * @param {string} paymentData.firstName - Buyer's first name
   * @param {string} paymentData.lastName - Buyer's last name
   * @param {string} paymentData.email - Buyer's email
   * @param {string} paymentData.phone - Buyer's phone (format: +21611222333)
   * @param {string} paymentData.orderId - Internal order/payment ID
   * @returns {Promise<Object>} Paymee response with token and payment_url
   */
  async initiatePayment(paymentData) {
    const { amount, note, firstName, lastName, email, phone, orderId } = paymentData;

    // Validate required fields
    if (!amount || !note || !firstName || !lastName || !email || !phone) {
      throw new Error('Missing required payment fields');
    }

    // Format phone number (Paymee requires +216 format for Tunisia)
    const formattedPhone = this.formatPhoneNumber(phone);

    const requestBody = {
      amount: parseFloat(amount),
      note,
      first_name: firstName,
      last_name: lastName,
      email,
      phone: formattedPhone,
      return_url: this.returnUrl,
      cancel_url: this.cancelUrl,
      webhook_url: this.webhookUrl,
      order_id: orderId || `ORD_${Date.now()}`,
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      // Check if response is OK (status 200-299)
      if (!response.ok) {
        // Server returned an error status
        const errorText = await response.text();
        console.error(`Paymee server error (${response.status}):`, errorText);
        throw new Error(`PAYMEE_SERVER_ERROR: Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!data.status || data.code !== 50) {
        throw new Error(data.message || 'Failed to initiate Paymee payment');
      }

      // Return payment data with gateway URL for iframe
      return {
        success: true,
        token: data.data.token,
        orderId: data.data.order_id,
        paymentUrl: data.data.payment_url,
        gatewayUrl: `${this.gatewayUrl}/${data.data.token}`,
        amount: data.data.amount,
      };
    } catch (error) {
      console.error('Paymee initiation error:', error);
      
      // Detect network/connection errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        throw new Error('PAYMEE_SERVER_DOWN: Payment gateway is currently unavailable. Please try again later.');
      }
      
      // Detect fetch errors (network issues)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('PAYMEE_SERVER_DOWN: Unable to connect to payment gateway. Please try again later.');
      }
      
      // Pass through server errors
      if (error.message.startsWith('PAYMEE_SERVER_ERROR') || error.message.startsWith('PAYMEE_SERVER_DOWN')) {
        throw error;
      }
      
      // Generic error
      throw new Error(`Paymee payment initiation failed: ${error.message}`);
    }
  }

  /**
   * Verify webhook checksum to ensure data integrity
   * checksum = md5(token + payment_status(1 or 0) + API Token)
   * @param {Object} webhookData - Data received from Paymee webhook
   * @returns {boolean} True if checksum is valid
   */
  verifyChecksum(webhookData) {
    const { token, payment_status, check_sum } = webhookData;
    
    if (!token || payment_status === undefined || !check_sum) {
      return false;
    }

    // payment_status is True/False in webhook, convert to 1/0
    const statusValue = payment_status ? '1' : '0';
    const expectedChecksum = crypto
      .createHash('md5')
      .update(`${token}${statusValue}${this.apiToken}`)
      .digest('hex');

    return expectedChecksum === check_sum;
  }

  /**
   * Process webhook data from Paymee
   * @param {Object} webhookData - Data from Paymee webhook
   * @returns {Object} Processed payment result
   */
  processWebhook(webhookData) {
    // Verify checksum first
    if (!this.verifyChecksum(webhookData)) {
      throw new Error('Invalid Paymee webhook checksum');
    }

    const {
      token,
      payment_status,
      order_id,
      transaction_id,
      amount,
      received_amount,
      cost,
      first_name,
      last_name,
      email,
      phone,
      note,
    } = webhookData;

    return {
      success: payment_status === true || payment_status === 'True',
      token,
      orderId: order_id,
      transactionId: transaction_id,
      amount,
      receivedAmount: received_amount,
      paymeeCommission: cost,
      customer: {
        firstName: first_name,
        lastName: last_name,
        email,
        phone,
      },
      note,
    };
  }

  /**
   * Format phone number to Paymee required format (+216XXXXXXXX)
   * @param {string} phone - Phone number in various formats
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phone) {
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // If starts with 00216, replace with +216
    if (cleaned.startsWith('00216')) {
      cleaned = '+216' + cleaned.slice(5);
    }
    // If starts with 216, add +
    else if (cleaned.startsWith('216')) {
      cleaned = '+' + cleaned;
    }
    // If starts with 0 (local format), add +216
    else if (cleaned.startsWith('0')) {
      cleaned = '+216' + cleaned.slice(1);
    }
    // If just 8 digits (local without prefix), add +216
    else if (cleaned.length === 8 && !cleaned.startsWith('+')) {
      cleaned = '+216' + cleaned;
    }
    // If doesn't have +, assume it needs +216 prefix
    else if (!cleaned.startsWith('+')) {
      cleaned = '+216' + cleaned;
    }

    return cleaned;
  }
}

export const paymeeService = new PaymeeService();
export default paymeeService;
