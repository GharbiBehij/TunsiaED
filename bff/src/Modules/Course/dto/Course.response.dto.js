// src/modules/Course/dto/Course.response.dto.js
import { z } from 'zod';

export const CourseResponseSchema = z.object({
  course: z.object({
    courseId: z.string(),
    title: z.string(),
    description: z.string(),
    instructorId: z.string(),
    instructorName: z.string(),
    category: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    price: z.number(),
    thumbnail: z.string().optional(),
    duration: z.number(),
    enrolledCount: z.number(),
    rating: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  message: z.string(),
});
