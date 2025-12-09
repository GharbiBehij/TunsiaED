// Stripe Payment Gateway Adapter
// Stripe Test/Sandbox integration (https://stripe.com)
// Isolates Stripe API from business logic

import Stripe from 'stripe';

// Initialize Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17', // Use latest stable API version
});

const STRIPE_CONFIG = {
  currency: process.env.STRIPE_CURRENCY || 'usd', // Can be changed to 'eur', 'gbp', etc.
  successUrl: process.env.STRIPE_SUCCESS_URL || 'https://tunisiaed-811f6.web.app/payment/success',
  cancelUrl: process.env.STRIPE_CANCEL_URL || 'https://tunisiaed-811f6.web.app/payment/cancel',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET, // For webhook signature verification
};

/**
 * Stripe Gateway Adapter
 * Handles all Stripe API interactions with similar interface to PaymeeAdapter
 */
export const StripeAdapter = {
  /**
   * Initiate payment using Stripe Checkout Session
   * @param {Object} paymentData - Payment information
   * @param {number} paymentData.amount - Amount in smallest currency unit (cents for USD, millimes for TND)
   * @param {string} paymentData.currency - Currency code (default: 'usd')
   * @param {string} paymentData.orderId - Internal order/payment ID
   * @param {string} paymentData.firstName - Customer first name
   * @param {string} paymentData.lastName - Customer last name
   * @param {string} paymentData.email - Customer email
   * @param {string} paymentData.phone - Customer phone (optional)
   * @param {string} paymentData.note - Payment note/description
   * @param {string} paymentData.successUrl - Success callback URL (optional)
   * @param {string} paymentData.cancelUrl - Cancel callback URL (optional)
   * @returns {Promise<Object>} { sessionId, checkoutUrl, amount, orderId }
   */
  async initiatePayment(paymentData) {
    try {
      const {
        amount,
        currency = STRIPE_CONFIG.currency,
        orderId,
        firstName,
        lastName,
        email,
        phone,
        note,
        successUrl = STRIPE_CONFIG.successUrl,
        cancelUrl = STRIPE_CONFIG.cancelUrl,
      } = paymentData;

      // Validate required fields
      if (!amount || !orderId || !email) {
        throw new Error('Missing required payment fields: amount, orderId, and email are required');
      }

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], // Accept card payments
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: note || 'TunisiaED Course Purchase',
                description: `Order ID: ${orderId}`,
              },
              unit_amount: Math.round(amount), // Ensure integer (cents/millimes)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&payment_id=${orderId}`,
        cancel_url: `${cancelUrl}?payment_id=${orderId}`,
        customer_email: email,
        client_reference_id: orderId, // Store our internal payment ID
        metadata: {
          orderId: orderId,
          firstName: firstName || '',
          lastName: lastName || '',
          phone: phone || '',
        },
        billing_address_collection: 'auto',
        payment_intent_data: {
          metadata: {
            orderId: orderId,
          },
        },
      });

      return {
        sessionId: session.id,
        checkoutUrl: session.url,
        amount: amount,
        orderId: orderId,
        currency: currency,
      };
    } catch (error) {
      console.error('Stripe initiation error:', error);
      throw new Error(
        error.message || 'Failed to initiate Stripe payment'
      );
    }
  },

  /**
   * Verify payment status by retrieving Checkout Session
   * @param {string} sessionId - Stripe Checkout Session ID
   * @returns {Promise<Object>} Payment status details
   */
  async verifyPayment(sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent'], // Get full payment intent details
      });

      const isPaid = session.payment_status === 'paid';
      const paymentIntent = session.payment_intent;

      return {
        success: isPaid,
        status: isPaid ? 'completed' : session.payment_status,
        amount: session.amount_total,
        currency: session.currency,
        orderId: session.client_reference_id || session.metadata?.orderId,
        transactionId: paymentIntent?.id || session.id,
        paymentDate: new Date(session.created * 1000).toISOString(),
        customerEmail: session.customer_email,
        raw: session,
      };
    } catch (error) {
      console.error('Stripe verification error:', error);
      return {
        success: false,
        status: 'error',
        message: error.message || 'Failed to verify payment',
      };
    }
  },

  /**
   * Retrieve payment by PaymentIntent ID
   * @param {string} paymentIntentId - Stripe Payment Intent ID
   * @returns {Promise<Object>} Payment details
   */
  async getPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        success: paymentIntent.status === 'succeeded',
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        orderId: paymentIntent.metadata?.orderId,
        transactionId: paymentIntent.id,
        paymentDate: new Date(paymentIntent.created * 1000).toISOString(),
        raw: paymentIntent,
      };
    } catch (error) {
      console.error('Stripe PaymentIntent retrieval error:', error);
      return {
        success: false,
        status: 'error',
        message: error.message || 'Failed to retrieve payment intent',
      };
    }
  },

  /**
   * Process webhook payload from Stripe
   * @param {string} payload - Raw webhook payload body (as string)
   * @param {string} signature - Stripe signature header (stripe-signature)
   * @returns {Object} Normalized payment status
   */
  processWebhook(payload, signature) {
    try {
      // Verify webhook signature
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        STRIPE_CONFIG.webhookSecret
      );

      // Handle different event types
      let paymentData = {};

      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          paymentData = {
            sessionId: session.id,
            status: session.payment_status === 'paid' ? 'completed' : session.payment_status,
            orderId: session.client_reference_id || session.metadata?.orderId,
            amount: session.amount_total,
            currency: session.currency,
            transactionId: session.payment_intent,
            paymentDate: new Date(session.created * 1000).toISOString(),
            customerEmail: session.customer_email,
            raw: event,
          };
          break;

        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          paymentData = {
            status: 'completed',
            orderId: paymentIntent.metadata?.orderId,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            transactionId: paymentIntent.id,
            paymentDate: new Date(paymentIntent.created * 1000).toISOString(),
            raw: event,
          };
          break;

        case 'payment_intent.payment_failed':
          const failedIntent = event.data.object;
          paymentData = {
            status: 'failed',
            orderId: failedIntent.metadata?.orderId,
            amount: failedIntent.amount,
            currency: failedIntent.currency,
            transactionId: failedIntent.id,
            error: failedIntent.last_payment_error?.message,
            raw: event,
          };
          break;

        default:
          console.log(`Unhandled Stripe event type: ${event.type}`);
          paymentData = {
            status: 'unknown',
            raw: event,
          };
      }

      return paymentData;
    } catch (error) {
      console.error('Stripe webhook processing error:', error);
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  },

  /**
   * Validate webhook signature
   * @param {string} payload - Raw webhook payload body (as string)
   * @param {string} signature - Stripe signature header (stripe-signature)
   * @returns {boolean} Is valid
   */
  validateWebhookSignature(payload, signature) {
    try {
      stripe.webhooks.constructEvent(
        payload,
        signature,
        STRIPE_CONFIG.webhookSecret
      );
      return true;
    } catch (error) {
      console.error('Stripe webhook signature validation failed:', error);
      return false;
    }
  },

  /**
   * Create a refund for a payment
   * @param {string} paymentIntentId - Stripe Payment Intent ID
   * @param {number} amount - Amount to refund (optional, defaults to full amount)
   * @returns {Promise<Object>} Refund details
   */
  async createRefund(paymentIntentId, amount = null) {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = Math.round(amount);
      }

      const refund = await stripe.refunds.create(refundData);

      return {
        success: refund.status === 'succeeded',
        refundId: refund.id,
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
        raw: refund,
      };
    } catch (error) {
      console.error('Stripe refund error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create refund',
      };
    }
  },

  /**
   * Get payment statuses enum
   * @returns {Object} Payment status constants
   */
  getPaymentStatuses() {
    return {
      PENDING: 'pending',
      COMPLETED: 'completed',
      SUCCEEDED: 'succeeded', // Stripe uses 'succeeded'
      FAILED: 'failed',
      CANCELLED: 'cancelled',
      REFUNDED: 'refunded',
      REQUIRES_ACTION: 'requires_action', // For 3D Secure
      PROCESSING: 'processing',
    };
  },

  /**
   * Convert amount from TND to USD (approximate conversion)
   * @param {number} amountInTND - Amount in TND
   * @returns {number} Amount in USD cents
   */
  convertTNDtoUSD(amountInTND) {
    // Approximate conversion rate: 1 TND ≈ 0.32 USD
    // Convert to cents (*100)
    const conversionRate = 0.32;
    return Math.round(amountInTND * conversionRate * 100);
  },

  /**
   * Convert amount from USD cents to TND millimes
   * @param {number} amountInCents - Amount in USD cents
   * @returns {number} Amount in TND
   */
  convertUSDtoTND(amountInCents) {
    // Approximate conversion rate: 1 USD ≈ 3.125 TND
    const conversionRate = 3.125;
    return Math.round((amountInCents / 100) * conversionRate * 1000) / 1000;
  },
};

export default StripeAdapter;
