// src/modules/Transaction/dto/Transaction.response.dto.js
import { z } from 'zod';

export const TransactionResponseSchema = z.object({
  transaction: z.object({
    transactionId: z.string(),
    paymentId: z.string(),
    userId: z.string(),
    courseId: z.string(),
    transactionType: z.enum(['payment', 'refund', 'subscription_renewal']),
    amount: z.number(),
    currency: z.string(),
    status: z.enum(['pending', 'completed', 'failed', 'cancelled']),
    paymentGateway: z.string().optional(),
    gatewayTransactionId: z.string().optional(),
    description: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  message: z.string(),
});
