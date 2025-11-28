import {z} from "zod";
import {priceSchema, costSchema, weightSchema, percentageSchema} from "@/lib/utils/util.schema";

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
    categoryID: z.uuid({message: 'Invalid Category ID'}).nullable().optional(),
    brandID: z.uuid({message: 'Invalid Brand ID'}).nullable().optional(),
    discountID: z.uuid({message: 'Invalid Discount ID'}).nullable().optional(),
})

export const BrandRequestSchema = z.object({
    name: z.string().min(1, {error: 'Name is required'}).max(50, {error: 'Name must be 50 characters or less'}),
    description: z.string().max(3000, {error: 'Description must be 3000 characters or less'}).optional(),
})

export const CategoryRequestSchema = z.object({
    name: z.string().min(2, {error: 'Name must be at least 2 characters long'}).max(50, {error: 'Name must be 50 characters or less'}),
    description: z.string().max(3000, {error: 'Description must be 3000 characters or less'}).optional(),
    discountID: z.uuid({message: 'Invalid Discount ID'}).nullable().optional(),
})

export const DiscountRequestSchema = z.object({
    discountCode: z.string().min(6, {error: 'Discount Code must be at least 6 characters'}).max(30, {error: 'Discount code must be 30 characters or less'}),
    name: z.string().min(1, {error: 'Discount name cannot be blank'}).max(50, {error: 'Discount name must be 50 characters or less'}),
    description: z.string().max(3000, {error: 'Description must be 3000 characters or less'}).optional(),
    discountPercentage: percentageSchema,
    active: z.coerce.boolean().default(true)
})