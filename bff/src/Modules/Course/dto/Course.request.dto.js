// src/modules/Course/dto/Course.request.dto.js
import { z } from 'zod';

export const CreateCourseRequest = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number().min(0, 'Price must be non-negative'),
  thumbnail: z.string().url().optional().or(z.literal('')),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
});

export const UpdateCourseRequest = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  thumbnail: z.string().url().optional().or(z.literal('')),
  duration: z.number().min(1, 'Duration must be at least 1 minute').optional(),
});

