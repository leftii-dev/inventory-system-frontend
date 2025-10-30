import z from "zod";

// Base object for update user schemas
const BaseUpdateUserSchema = z.object({
    email: z.preprocess(
        (val) => val === null || val === '' ? undefined : val,
        z.email().toLowerCase().optional()
    ),
    name: z.string()
        .min(2, {error: "Name must be at least 2 characters long"})
        .max(50, {error: "Name must be at most 50 characters long"}),
    password: z.preprocess(
        (val) => val === '' ? undefined : val,
        z.string()
        .min(8, {error: "Password must be at least 8 characters long"})
        .max(128, {error: "Password must be at most 128 characters long"})
        .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
        .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter"})
        .regex(/[0-9]/, {message: "Password must contain at least one number"})
        .regex(/[^a-zA-Z0-9]/, {message: "Password must contain at least one special character"})
        .optional()
    ),
    confirmPassword: z.preprocess(
        (val) => val === '' ? undefined : val,
        z.string().optional()
    ),// Only for validation, will be stripped out later
    pictureUrl: z.preprocess(
        (val) => (val === null || val === undefined ? '' : val),
        z.string()).optional(),
    });

export const SelfUpdateUserSchema = BaseUpdateUserSchema
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }).transform(({confirmPassword , ...rest}) => rest);

// Schema for use with requests to update OTHER users
export const AdminUpdateUserSchema = BaseUpdateUserSchema.extend({
    id: z.uuid(),
    roles: z.array(z.string()).optional(),
    enabled: z.boolean().optional(),
    accountNonExpired: z.boolean().optional(),
    accountNonLocked: z.boolean().optional(),
    credentialsNonExpired: z.boolean().optional(),
})
// Schema for User Response
export const UserResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.email().nullable().optional(),
    pictureUrl: z.url().nullable().optional(),
    roles: z.array(z.string()),
}).catchall(z.unknown())

export type UserResponse = z.infer<typeof UserResponseSchema>;