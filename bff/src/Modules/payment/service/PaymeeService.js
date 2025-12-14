// PaymeeService - Paymee Payment Gateway Integration
// Handles payment initiation, webhook verification, and status checks
// Documentation: https://www.paymee.tn/paymee-integration-without-redirection

import crypto from 'crypto';

const PAYMEE_CONFIG = {
  SANDBOX_URL: 'https://sandbox.paymee.tn/api/v2/payment/create',
  LIVE_URL: 'https://app.paymee.tn/api/v2/payment/create',
  SANDBOX_GATEWAY: 'https://sandbox.paymee.tn/gateway',
  LIVE_GATEWAY: 'https://app.paymee.tn/gateway',
};

class PaymeeService {
  constructor() {
    this.apiToken = process.env.PAYMEE_API_KEY; // single token provided
    this.isProduction = process.env.NODE_ENV === 'production';

    // Base URLs
    this.baseUrl = this.isProduction ? PAYMEE_CONFIG.LIVE_URL : PAYMEE_CONFIG.SANDBOX_URL;
    this.gatewayUrl = this.isProduction ? PAYMEE_CONFIG.LIVE_GATEWAY : PAYMEE_CONFIG.SANDBOX_GATEWAY;

    // Webhook / Return URLs
    this.webhookUrl = process.env.PAYMEE_WEBHOOK_URL;
    this.successUrl = process.env.PAYMEE_SUCCESS_URL;
    this.cancelUrl = process.env.PAYMEE_CANCEL_URL;
    this.returnUrl = this.successUrl; // for simplicity, use success URL as return URL

    // Currency
    this.currency = process.env.PAYMEE_CURRENCY || 'TND';
  };

  async initiatePayment(paymentData) {
    const { amount, note, firstName, lastName, email, phone, orderId } = paymentData;

    console.log('📋 [PaymeeService] Validating payment data:', {
      amount,
      note,
      firstName,
      lastName,
      email,
      phone,
      orderId,
      hasAmount: !!amount,
      hasNote: !!note,
      hasFirstName: !!firstName,
      hasLastName: !!lastName,
      hasEmail: !!email,
      hasPhone: !!phone,
    });

    if (!amount || !note || !firstName || !lastName || !email || !phone) {
      const missing = [];
      if (!amount) missing.push('amount');
      if (!note) missing.push('note');
      if (!firstName) missing.push('firstName');
      if (!lastName) missing.push('lastName');
      if (!email) missing.push('email');
      if (!phone) missing.push('phone');
      
      const error = `Missing required payment fields: ${missing.join(', ')}`;
      console.error('❌ [PaymeeService] Validation failed:', error);
      throw new Error(error);
    }

    const formattedPhone = this.formatPhoneNumber(phone);

    const requestBody = {
       amount: parseFloat(amount),
       note,
       first_name: firstName,
       last_name: lastName,
       email,
       phone: formattedPhone,
       currency: this.currency,
       return_url: this.successUrl,
       cancel_url: this.cancelUrl,
       webhook_url: this.webhookUrl,
       order_id: orderId || `ORD_${Date.now()}`,
       is_test: this.isProduction ? 0 : 1,
};

    try {
      console.log('📡 [PaymeeService] Making request to:', this.baseUrl);
      console.log('🔑 [PaymeeService] Using token:', this.apiToken ? '***' + this.apiToken.slice(-4) : 'NOT SET');
      console.log('📦 [PaymeeService] Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Token ${this.apiToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 [PaymeeService] Response status:', response.status);
      console.log('📡 [PaymeeService] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [PaymeeService] Server error (${response.status}):`, errorText);
        throw new Error(`PAYMEE_SERVER_ERROR: Server returned ${response.status}`);
      }

      const responseText = await response.text();
      console.log('📡 [PaymeeService] Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ [PaymeeService] Failed to parse JSON response:', parseError.message);
        console.error('❌ [PaymeeService] Response was:', responseText);
        throw new Error(`PAYMEE_PARSE_ERROR: Invalid JSON response from Paymee API`);
      }

      if (!data.status || data.code !== 50) {
        console.error('❌ [PaymeeService] Paymee API returned error:', data);
        throw new Error(data.message || 'Failed to initiate Paymee payment');
      }

      console.log('✅ [PaymeeService] Paymee payment initiated successfully:', {
        token: data.data?.token,
        orderId: data.data?.order_id,
        paymentUrl: data.data?.payment_url
      });

      return {
        success: data.status === true || data.code === 50,
        token: data.data.token,
        orderId: data.data.order_id,
        paymentUrl: data.data.payment_url,
        gatewayUrl: `${this.gatewayUrl}/${data.data.token}`,
        amount: data.data.amount,
      };
    } catch (error) {
      console.error('Paymee initiation error:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        throw new Error('PAYMEE_SERVER_DOWN: Payment gateway is currently unavailable. Please try again later.');
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('PAYMEE_SERVER_DOWN: Unable to connect to payment gateway. Please try again later.');
      }
      if (error.message.startsWith('PAYMEE_SERVER_ERROR') || error.message.startsWith('PAYMEE_SERVER_DOWN')) {
        throw error;
      }
      throw new Error(`Paymee payment initiation failed: ${error.message}`);
    }
  }

  verifyChecksum(webhookData) {
    const { token, payment_status, check_sum } = webhookData;
    if (!token || payment_status === undefined || !check_sum) {
      return false;
    }

    const statusValue = payment_status ? '1' : '0';
    const expectedChecksum = crypto
      .createHash('md5')
      .update(`${token}${statusValue}${this.apiToken}`)
      .digest('hex');

    return expectedChecksum === check_sum;
  }

  processWebhook(webhookData) {
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

  formatPhoneNumber(phone) {
    let cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('00216')) {
      cleaned = '+216' + cleaned.slice(5);
    } else if (cleaned.startsWith('216')) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      cleaned = '+216' + cleaned.slice(1);
    } else if (cleaned.length === 8 && !cleaned.startsWith('+')) {
      cleaned = '+216' + cleaned;
    } else if (!cleaned.startsWith('+')) {
      cleaned = '+216' + cleaned;
    }
    return cleaned;
  }
}

export const paymeeService = new PaymeeService();
export default paymeeService;
