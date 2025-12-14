// src/modules/Course/Validators/Course.schema.js
import { z } from 'zod';

export const OnboardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner'),
  price: z.number().min(0, "Price cannot be negative").default(0),
  thumbnail: z.string().url("Invalid URL").optional().nullable(),
  duration: z.number().min(0, "Duration cannot be negative").optional(),
});

export const UpdateCourseSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(10).optional(),
  category: z.string().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  price: z.number().min(0).optional(),
  thumbnail: z.string().url().optional().nullable(),
  duration: z.number().min(0).optional(),
});