import {z} from 'zod';
import {error} from "next/dist/build/output/log";

// Schema for user registration
export const RegisterUserSchema = z.object({
    email: z.email({error: "Please provide a valid email"}).toLowerCase(),
    name: z.string().min(2).max(50),
    password: z.string()
        .min(8, {error: "Password must be at least 8 characters long"})
        .max(128, {error: "Password must be at most 128 characters long"})
        .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
        .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter"})
        .regex(/[0-9]/, {message: "Password must contain at least one number"})
        .regex(/[^a-zA-Z0-9]/, {message: "Password must contain at least one special character"}),
    confirmPassword: z.string(), // Only for validation, will be stripped out later
    roles: z.array(z.string()).nullable().optional(),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})
    .transform(({confirmPassword , ...rest}) => rest);

export const LoginUserSchema = z.object({
    email: z.preprocess(
        (val) => (typeof val === "number" ? String(val) : typeof val === "string" ? val.trim() : val),
        z.email({ error: "Invalid email or password" })
            .or(z.string().regex(/^\d{6}$/, { error: "Invalid email or password" }))
    ),
    password: z.string({ error: "Invalid email or password" }),
})