// src/modules/User/dto/User.response.dto.js
import { z } from 'zod';

export const UserResponseSchema = z.object({
  user: z.object({
    userId: z.string(),
    email: z.string().email(),
    name: z.string(),
    role: z.boolean(),
    createdAt: z.string(),
    phoneNumber: z.number(),
  }),
  token: z.string(),
});
