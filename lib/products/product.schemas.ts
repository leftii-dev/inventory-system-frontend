import {z} from "zod";

export const ProductImageRequestSchema = z.object({
    imageUrl: z.string()
        .min(5, {error: 'URL must be at least 5 characters'})
        .max(500, {error: 'URL must be 500 characters or less'}),
    displayOrder: z.coerce.number().min(0, {error: 'Display order must be a positive integer'}),
    isDefault: z.coerce.boolean().default(false),
    altText: z.string().max(255, {error: 'Alt Text must be 255 characters or less'}),
    imageType: z.string().max(50, {error: 'Image type must be 50 characters or less'}),
    file: z.instanceof(File).optional()
})