// src/modules/Enrollement/dto/Enrollement.request.dto.ts
import { z } from 'zod';

export const CreateEnrollmentRequest = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  paymentType: z.enum(['individual', 'subscription']),
  subscriptionType: z.enum(['monthly', 'yearly']).optional(), // Required if paymentType is 'subscription'
});

