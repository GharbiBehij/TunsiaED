// src/modules/Enrollement/dto/Enrollement.response.dto.js
import { z } from 'zod';

export const EnrollmentResponseSchema = z.object({
  enrollment: z.object({
    enrollmentId: z.string(),
    userId: z.string(),
    courseId: z.string(),
    enrollmentDate: z.string(),
    status: z.enum(['active', 'completed', 'cancelled']),
    paymentId: z.string().optional(),
    transactionId: z.string().optional(),
  }),
  message: z.string(),
});
