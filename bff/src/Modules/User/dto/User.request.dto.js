// src/modules/Auth/dto/Auth.request.dto.ts
import { z } from 'zod';

export const CreateUserRequest = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
  name: z.string().min(1, 'Name required'),
  phoneNumber: z.number(),
  role: z.boolean(),
});

export const LoginUserRequest = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
});