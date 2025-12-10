/**
 * StripeService - Stripe Payment Gateway Integration
 * 
 * This is the SOLE Stripe integration point for the payment module.
 * Handles all Stripe API interactions including:
 * - Payment initiation (Checkout Sessions)
 * - Webhook verification and processing
 * - Payment status checks
 * - Refund operations
 * 
 * Architecture:
 * - PaymentService → StripeService → Stripe API
 * - This service abstracts Stripe-specific logic from business logic
 * 
 * Documentation: https://stripe.com/docs/api
 * API Version: 2024-11-20.acacia
 * 
 * @module StripeService
 * @since 1.0.0
 */

import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia', // Latest Stripe API version (December 2024)
});

// Stripe Configuration
const STRIPE_CONFIG = {
  currency: process.env.STRIPE_CURRENCY || 'usd',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  
  // Return URLs after payment
  successUrl: process.env.STRIPE_SUCCESS_URL || 'https://tunisiaed-811f6.web.app/payment/success',
  cancelUrl: process.env.STRIPE_CANCEL_URL || 'https://tunisiaed-811f6.web.app/payment/cancel',
};

/**
 * StripeService - Service for Stripe payment gateway operations
 * Mirrors PaymeeService interface for easy switching
 */
class StripeService {
  constructor() {
    this.stripe = stripe;
    this.currency = STRIPE_CONFIG.currency;
    this.webhookSecret = STRIPE_CONFIG.webhookSecret;
    this.successUrl = STRIPE_CONFIG.successUrl;
    this.cancelUrl = STRIPE_CONFIG.cancelUrl;
  }

  /**
   * Initiate a Stripe payment using Checkout Session
   * @param {Object} paymentData - Payment details
   * @param {number} paymentData.amount - Payment amount (in smallest currency unit)
   * @param {string} paymentData.note - Note about the payment (e.g., "Course: React Basics")
   * @param {string} paymentData.firstName - Buyer's first name
   * @param {string} paymentData.lastName - Buyer's last name
   * @param {string} paymentData.email - Buyer's email
   * @param {string} paymentData.phone - Buyer's phone (optional)
   * @param {string} paymentData.orderId - Internal order/payment ID
   * @param {string} paymentData.currency - Currency code (optional, default: USD)
   * @returns {Promise<Object>} Stripe response with sessionId and checkoutUrl
   */
  async initiatePayment(paymentData) {
    console.log('🔵 [StripeService] initiatePayment called:', {
      amount: paymentData.amount,
      orderId: paymentData.orderId,
      email: paymentData.email
    });
    
    const { 
      amount, 
      note, 
      firstName, 
      lastName, 
      email, 
      phone, 
      orderId,
      currency = this.currency 
    } = paymentData;

    // Validate required fields
    if (!amount || !email || !orderId) {
      throw new Error('Missing required payment fields: amount, email, and orderId');
    }

    // Ensure amount is an integer (Stripe requires smallest currency unit)
    const amountInCents = Math.round(amount);

    try {
      // Create Stripe Checkout Session
      console.log('🔵 [StripeService] Creating Stripe checkout session...');
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: note || 'TunisiaED Course Purchase',
                description: orderId ? `Order #${orderId}` : undefined,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${this.successUrl}?session_id={CHECKOUT_SESSION_ID}&payment_id=${orderId}`,
        cancel_url: `${this.cancelUrl}?payment_id=${orderId}`,
        customer_email: email,
        client_reference_id: orderId,
        metadata: {
          orderId,
          firstName: firstName || '',
          lastName: lastName || '',
          phone: phone || '',
        },
        billing_address_collection: 'auto',
        payment_intent_data: {
          metadata: {
            orderId,
            customerName: `${firstName || ''} ${lastName || ''}`.trim(),
          },
        },
      });

      // Return payment data in Paymee-compatible format
      console.log('✅ [StripeService] Stripe session created successfully:', {
        sessionId: session.id,
        checkoutUrl: session.url
      });
      return {
        success: true,
        token: session.id, // Use sessionId as token for consistency
        orderId: orderId,
        paymentUrl: session.url,
        gatewayUrl: session.url, // Checkout URL
        amount: amountInCents,
        currency: currency,
      };
    } catch (error) {
      console.error('❌ [StripeService] Stripe initiation error:', {
        error: error.message,
        type: error.type,
        code: error.code
      });
      
      // Detect API errors
      if (error.type === 'StripeConnectionError') {
        throw new Error('STRIPE_SERVER_DOWN: Payment gateway is currently unavailable. Please try again later.');
      }
      
      if (error.type === 'StripeAuthenticationError') {
        throw new Error('STRIPE_AUTH_ERROR: Payment gateway authentication failed. Please contact support.');
      }
      
      // Generic error
      throw new Error(`Stripe payment initiation failed: ${error.message}`);
    }
  }

  /**
   * Verify payment status by retrieving Checkout Session
   * @param {string} sessionId - Stripe Checkout Session ID
   * @returns {Promise<Object>} Payment verification result
   */
  async verifyPayment(sessionId) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent'],
      });

      const isPaid = session.payment_status === 'paid';

      return {
        success: isPaid,
        status: isPaid ? 'completed' : session.payment_status,
        amount: session.amount_total,
        currency: session.currency,
        orderId: session.client_reference_id || session.metadata?.orderId,
        transactionId: session.payment_intent?.id || session.id,
        paymentDate: new Date(session.created * 1000).toISOString(),
        customerEmail: session.customer_email,
        metadata: session.metadata,
      };
    } catch (error) {
      console.error('Stripe verification error:', error);
      return {
        success: false,
        status: 'error',
        message: error.message,
      };
    }
  }

  /**
   * Verify webhook signature and parse event
   * @param {string} payload - Raw request body (as string)
   * @param {string} signature - Stripe-Signature header
   * @returns {Object} Parsed and verified webhook event
   */
  verifyWebhook(payload, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );
      return event;
    } catch (error) {
      console.error('Stripe webhook verification failed:', error);
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  }

  /**
   * Process webhook data from Stripe
   * Simplified version that expects pre-parsed webhook body
   * Mirrors Paymee's processWebhook interface
   * @param {Object} webhookBody - Webhook request body (already parsed)
   * @returns {Object} Normalized payment data
   */
  processWebhook(webhookBody) {
    console.log('🔵 [StripeService] processWebhook called:', {
      eventType: webhookBody?.type,
      eventId: webhookBody?.id
    });
    
    // For Stripe, the webhook body is already the event object
    // Extract the actual event data
    const event = webhookBody;
    
    const result = this.processWebhookEvent(event);
    console.log('✅ [StripeService] Webhook processed:', {
      success: result.success,
      status: result.status,
      orderId: result.orderId
    });
    return result;
  }

  /**
   * Process webhook event and extract payment data
   * Mirrors Paymee's processWebhook interface
   * @param {Object} event - Stripe webhook event (already verified)
   * @returns {Object} Normalized payment data
   */
  processWebhookEvent(event) {
    let paymentData = {
      success: false,
      status: 'unknown',
    };

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        paymentData = {
          success: session.payment_status === 'paid',
          status: session.payment_status === 'paid' ? 'completed' : session.payment_status,
          sessionId: session.id,
          orderId: session.client_reference_id || session.metadata?.orderId,
          amount: session.amount_total,
          currency: session.currency,
          transactionId: session.payment_intent,
          paymentDate: new Date(session.created * 1000).toISOString(),
          customerEmail: session.customer_email,
          customer: {
            firstName: session.metadata?.firstName || '',
            lastName: session.metadata?.lastName || '',
            phone: session.metadata?.phone || '',
          },
        };
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        paymentData = {
          success: true,
          status: 'completed',
          orderId: paymentIntent.metadata?.orderId,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          transactionId: paymentIntent.id,
          paymentDate: new Date(paymentIntent.created * 1000).toISOString(),
        };
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        paymentData = {
          success: false,
          status: 'failed',
          orderId: failedIntent.metadata?.orderId,
          amount: failedIntent.amount,
          currency: failedIntent.currency,
          transactionId: failedIntent.id,
          error: failedIntent.last_payment_error?.message,
        };
        break;

      default:
        console.log(`Unhandled Stripe webhook event: ${event.type}`);
    }

    return paymentData;
  }

  /**
   * Create a refund
   * @param {string} paymentIntentId - Payment Intent ID
   * @param {number} amount - Amount to refund (optional)
   * @returns {Promise<Object>} Refund result
   */
  async createRefund(paymentIntentId, amount = null) {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = Math.round(amount);
      }

      const refund = await this.stripe.refunds.create(refundData);

      return {
        success: refund.status === 'succeeded',
        refundId: refund.id,
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
      };
    } catch (error) {
      console.error('Stripe refund error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Format phone number (Stripe doesn't require specific format)
   * @param {string} phone - Phone number
   * @returns {string} Formatted phone
   */
  formatPhoneNumber(phone) {
    if (!phone) return '';
    // Remove all non-numeric characters except +
    return phone.replace(/[^\d+]/g, '');
  }

  /**
   * Currency conversion helpers
   */
  
  /**
   * Convert TND to USD cents (approximate)
   * @param {number} tndAmount - Amount in TND
   * @returns {number} Amount in USD cents
   */
  convertTNDtoUSDCents(tndAmount) {
    const conversionRate = 0.32; // 1 TND ≈ 0.32 USD
    return Math.round(tndAmount * conversionRate * 100);
  }

  /**
   * Convert USD cents to TND
   * @param {number} usdCents - Amount in USD cents
   * @returns {number} Amount in TND
   */
  convertUSDCentsToTND(usdCents) {
    const conversionRate = 3.125; // 1 USD ≈ 3.125 TND
    return Math.round((usdCents / 100) * conversionRate * 1000) / 1000;
  }
}

// Export singleton instance
export const stripeService = new StripeService();
