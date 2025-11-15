import {z} from "zod";
import {priceSchema, costSchema, weightSchema} from "@/lib/utils/util.schema";

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

export const ProductRequestSchema = z.object({
    sku: z.string().max(20, {error: 'SKU must be 20 characters or less'}),
    name: z.string().min(5, {error: 'Name must be at least 5 characters'}).max(100, {error: 'Name must be 100 characters or less'}),
    description: z.string().max(3000, {error: 'Description must be 3000 characters or less'}),
    price: priceSchema,
    cost: costSchema,
    weight: weightSchema,
    dimensions: z.record(z.string(), z.unknown()),
    additionalDetails: z.record(z.string(), z.unknown()),
    isActive: z.coerce.boolean().default(true),
    categoryId: z.uuid({message: 'Invalid Category ID'}),
    brandId: z.uuid({message: 'Invalid Brand ID'}).optional(),
    discountId: z.uuid({message: 'Invalid Discount ID'}).optional(),
})