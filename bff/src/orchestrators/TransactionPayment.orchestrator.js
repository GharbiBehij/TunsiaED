// Transaction Payment Orchestrator
// Orchestrates cross-module operations between Transaction and Payment modules

import { transactionService } from '../Modules/Transaction/service/Transaction.service.js';
import { paymentService } from '../Modules/payment/service/Payment.service.js';
import { TransactionPermission } from '../Modules/Transaction/service/TransactionPermission.js';
import { cacheClient, REDIS_KEY_REGISTRY } from '../core/cache/cacheClient.js';

export class TransactionPaymentOrchestrator {
  // ====================================================================
  // TRANSACTION + PAYMENT OPERATIONS
  // ====================================================================

  /**
   * Create transaction and sync payment status
   * Cross-module: Transaction + Payment
   * @param {Object} user - Authenticated user
   * @param {Object} data - { paymentId, transactionType, paymentGateway, gatewayTransactionId, description }
   * @returns {Object} Transaction DTO with payment info
   */
  async createTransactionWithPaymentSync(user, data) {
    // 1. Get and validate payment (Payment service - internal)
    const payment = await paymentService.getPaymentByIdInternal(data.paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // 2. Check permission
    if (!TransactionPermission.create(user, { userId: payment.userId })) {
      throw new Error('Unauthorized');
    }

    // 3. Create transaction (Transaction service - internal)
    const transaction = await transactionService.createTransactionInternal({
      paymentId: data.paymentId,
      userId: user.uid,
      courseId: payment.courseId,
      transactionType: data.transactionType || 'course_purchase',
      amount: payment.amount,
      currency: payment.currency || 'TND',
      status: 'pending',
      paymentGateway: data.paymentGateway || null,
      gatewayTransactionId: data.gatewayTransactionId || null,
      description: data.description || null,
    });

    // 4. Sync payment status (Payment service - internal)
    await paymentService.updatePaymentInternal(data.paymentId, {
      status: 'completed',
      transactionId: transaction.transactionId,
    });

    // 5. Invalidate affected cache keys
    console.log('🗑️ [Orchestrator] Invalidating cache keys for transaction creation...');
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.STUDENT_DASHBOARD);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.INSTRUCTOR_DASHBOARD);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.TRANSACTIONS);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.PAYMENTS);

    // 6. Return clean DTO
    return {
      transactionId: transaction.transactionId,
      paymentId: transaction.paymentId,
      userId: transaction.userId,
      courseId: transaction.courseId,
      transactionType: transaction.transactionType,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      paymentGateway: transaction.paymentGateway,
      gatewayTransactionId: transaction.gatewayTransactionId,
      createdAt: transaction.createdAt,
      payment: {
        paymentId: payment.paymentId,
        status: 'completed',
        courseTitle: payment.courseTitle,
      },
    };
  }

  /**
   * Update transaction and sync payment status
   * Cross-module: Transaction + Payment
   * @param {string} transactionId - Transaction ID
   * @param {Object} user - Authenticated user
   * @param {Object} data - Update data including status
   * @returns {Object} Updated transaction DTO
   */
  async updateTransactionWithPaymentSync(transactionId, user, data) {
    // 1. Check permission
    if (!TransactionPermission.update(user)) {
      throw new Error('Unauthorized');
    }

    // 2. Update transaction (Transaction service - internal)
    const transaction = await transactionService.updateTransactionInternal(transactionId, data);

    // 3. If status changed, sync to payment (Payment service - internal)
    if (data.status) {
      await paymentService.updatePaymentInternal(transaction.paymentId, {
        status: data.status,
        transactionId,
      });
    }

    // 4. Invalidate affected cache keys
    console.log('🗑️ [Orchestrator] Invalidating cache keys for transaction update...');
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.STUDENT_DASHBOARD);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.INSTRUCTOR_DASHBOARD);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.TRANSACTIONS);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.PAYMENTS);

    // 5. Return clean DTO
    return {
      transactionId: transaction.transactionId,
      paymentId: transaction.paymentId,
      userId: transaction.userId,
      courseId: transaction.courseId,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      updatedAt: transaction.updatedAt,
    };
  }

  /**
   * Get transaction with payment details
   * Cross-module: Transaction + Payment
   * @param {string} transactionId - Transaction ID
   * @returns {Object} Transaction with payment DTO
   */
  async getTransactionWithPayment(transactionId) {
    // 1. Get transaction (Transaction service - internal)
    const transaction = await transactionService.getTransactionByIdInternal(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // 2. Get payment (Payment service - internal)
    const payment = await paymentService.getPaymentByIdInternal(transaction.paymentId);

    // 3. Return enriched DTO
    return {
      ...transaction,
      payment: payment ? {
        paymentId: payment.paymentId,
        courseTitle: payment.courseTitle,
        paymentType: payment.paymentType,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
      } : null,
    };
  }

  /**
   * Process refund - updates both transaction and payment
   * Cross-module: Transaction + Payment
   * @param {string} transactionId - Transaction ID
   * @param {Object} user - Authenticated user
   * @param {Object} refundData - { reason, refundAmount }
   * @returns {Object} Refund result DTO
   */
  async processRefund(transactionId, user, refundData) {
    // 1. Check admin permission
    if (!TransactionPermission.update(user)) {
      throw new Error('Unauthorized: Admin only');
    }

    // 2. Get original transaction (Transaction service - internal)
    const transaction = await transactionService.getTransactionByIdInternal(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status === 'refunded') {
      throw new Error('Transaction already refunded');
    }

    // 3. Create refund transaction (Transaction service - internal)
    const refundTransaction = await transactionService.createTransactionInternal({
      paymentId: transaction.paymentId,
      userId: transaction.userId,
      courseId: transaction.courseId,
      transactionType: 'refund',
      amount: -(refundData.refundAmount || transaction.amount),
      currency: transaction.currency,
      status: 'completed',
      paymentGateway: transaction.paymentGateway,
      description: refundData.reason || 'Refund',
      metadata: {
        originalTransactionId: transactionId,
      },
    });

    // 4. Update original transaction status
    await transactionService.updateTransactionInternal(transactionId, {
      status: 'refunded',
    });

    // 5. Update payment status (Payment service - internal)
    await paymentService.updatePaymentInternal(transaction.paymentId, {
      status: 'refunded',
    });

    // 6. Invalidate affected cache keys
    console.log('🗑️ [Orchestrator] Invalidating cache keys for refund processing...');
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.STUDENT_DASHBOARD);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.INSTRUCTOR_DASHBOARD);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.TRANSACTIONS);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.PAYMENTS);

    // 7. Return clean DTO
    return {
      originalTransactionId: transactionId,
      refundTransactionId: refundTransaction.transactionId,
      refundAmount: Math.abs(refundTransaction.amount),
      status: 'refunded',
      reason: refundData.reason,
    };
  }
}

export const transactionPaymentOrchestrator = new TransactionPaymentOrchestrator();
