import {z} from 'zod';

export const RegisterUserSchema = z.object({
    email: z.email(),
    name: z.string().min(2).max(50),
    password: z.string()
        .min(8, {error: "Password must be at least 8 characters long"})
        .max(128, {error: "Password must be at most 128 characters long"})
        .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
        .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter"})
        .regex(/[0-9]/, {message: "Password must contain at least one number"})
        .regex(/[^a-zA-Z0-9]/, {message: "Password must contain at least one special character"})
});