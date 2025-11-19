// src/modules/payment/dto/Payment.response.dto.js
import { z } from 'zod';

export const PaymentResponseSchema = z.object({
  payment: z.object({
    paymentId: z.string(),
    userId: z.string(),
    courseId: z.string(),
    amount: z.number(),
    currency: z.string(),
    paymentType: z.enum(['individual', 'subscription']),
    subscriptionType: z.enum(['monthly', 'yearly']).optional(),
    paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal', 'bank_transfer']),
    status: z.enum(['pending', 'completed', 'failed', 'refunded', 'cancelled']),
    transactionId: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  message: z.string(),
});
