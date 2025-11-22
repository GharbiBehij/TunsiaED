// src/modules/payment/dto/Payment.request.dto.js
import { z } from 'zod';

export const CreatePaymentRequest = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  amount: z.number().min(0, 'Amount must be non-negative'),
  paymentType: z.enum(['individual', 'subscription']),
  subscriptionType: z.enum(['monthly', 'yearly']).optional(), // Required if paymentType is 'subscription'
  paymentMethod: z.enum(['credit_card', 'debit_card', 'bank_transfer']),
  currency: z.string().default('USD'),
});


export const UpdatePaymentRequest = z.object({
  status: z.enum(['pending', 'completed', 'failed', 'refunded', 'cancelled']).optional(),
});


