// src/modules/Transaction/dto/Transaction.request.dto.ts
import { z } from 'zod';

export const CreateTransactionRequest = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  transactionType: z.enum(['payment', 'refund', 'subscription_renewal']),
  amount: z.number().min(0, 'Amount must be non-negative'),
  currency: z.string().default('USD'),
  paymentGateway: z.string().optional(),
  gatewayTransactionId: z.string().optional(),
  description: z.string().optional(),
});

export const UpdateTransactionRequest = z.object({
  status: z.enum(['pending', 'completed', 'failed', 'cancelled']).optional(),
  gatewayTransactionId: z.string().optional(),
  description: z.string().optional(),
});

