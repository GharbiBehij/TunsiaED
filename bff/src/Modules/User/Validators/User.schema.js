// bff/src/Modules/User/Validators/User.schema.js
import { z } from 'zod';

export const OnboardUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().regex(/^[a-zA-Z\s\-']+$/, "Name contains invalid characters").min(2).optional().nullable(),
  phone: z.string().regex(/^[\d\+\-\s\(\)]+$/).nullable().optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  birthPlace: z.string().regex(/^[a-zA-Z\s,\-']+$/, "Invalid birthPlace").min(2).optional().nullable(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  role: z.enum(['student', 'instructor']).default('student').optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().regex(/^[a-zA-Z\s\-']+$/, "Name contains invalid characters").min(2).optional().nullable(),
  phone: z.string().regex(/^[\d\+\-\s\(\)]+$/).nullable().optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  birthPlace: z.string().regex(/^[a-zA-Z\s,\-']+$/, "Invalid birthPlace").min(2).optional().nullable(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  avatar: z.string().url("Invalid avatar URL").optional().nullable(),
  profileImage: z.string().url("Invalid profile image URL").optional().nullable(),
});