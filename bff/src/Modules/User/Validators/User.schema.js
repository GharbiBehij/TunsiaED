import {z} from 'zod'
export const OnboardSchema = z.object({
    name: z.string().regex(/^[a-zA-Z\s\-']+$/, "Name contains invalid characters").min(2).optional(),
    phone: z.string().regex(/^[\d\+\-\s\(\)]+$/).nullable().optional(),
    role: z.enum(['student', 'instructor']).default('student'),
    // ADD ALL YOUR EXTRA FIELDS HERE — forever
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),        // "1998-05-20"
    birthPlace: z.string().regex(/^[a-zA-Z\s,\-']+$/, "Invalid birthPlace").min(2).optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    bio: z.string().max(500).optional(),
    // add linkedin, github, photoURL, etc. later → just add here
  });