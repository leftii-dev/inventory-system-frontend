import {z} from "zod";
import {percentageSchema, costSchema, presentOrFutureDateSchema, localDateSchema} from "../utils/util.schema";

export const PurchaseOrderRequestSchema = z.object({
    dateExpected: presentOrFutureDateSchema,
    notes: z.string().max(3000, { error: "Notes cannot exceed 3000 characters" }).optional(),
    vendorID: z.uuid({ error: "Vendor ID must be a valid UUID" }),
    statusID: z.uuid({ error: "Status must be a valid UUID" })
})

export const PurchaseOrderItemRequestSchema = z.object({
    costUnit: costSchema,
    quantity: z.coerce.number()
        .min(1, {error: "Quantity must be positive"})
        .max(10000, {error: "Quantity cannot exceed 10,000"}),
    purchaseOrderID: z.uuid({ error: "Purchase Order ID must be a valid UUID" }),
    productID: z.uuid({ error: "Purchase Order ID must be a valid UUID" }),
})

export const ReceivingVoucherRequestSchema = z.object({
    freightCost: costSchema,
    feeCost: costSchema,
    discountPercent: percentageSchema,
    paymentDiscountDate: presentOrFutureDateSchema,
    paymentNetDate: presentOrFutureDateSchema,
    notes: z.string().max(3000, {error: "Notse cannot exceed 3000 characters"}),
    purchaseOrderID: z.uuid({error: "Purchase Order ID must be a valid UUID" }),
    locationID: z.uuid({error: "Location ID must be a valid UUID"}),
    vendorID: z.uuid({error: "Vendor ID must be a valid UUID" }),
    statusID: z.uuid({error: "Status must be a valid UUID" }),
})

export const ReceivingVoucherItemRequestSchema = z.object({
    quantity: z.coerce.number()
        .min(1, {error: "Quantity must be non-negative" })
        .max(10_000, {error: "Quantity cannot exceed 10,000"}),
    discountPercentage: percentageSchema,
    discountReason: z.string().max(50, {error: "Discount reason must not exceed 50 characters"}).optional(),
    costUnit: costSchema,
    productID: z.uuid({ error: "Product ID must be a valid UUID" }),
    receivingVoucherID: z.uuid({ error: "Receiving Voucher ID must be a valid UUID" }),
})

export const InventoryRequestSchema = z.object({
    quantity: z.coerce.number().min(0, {error: "Quantity must be non-negative"}).max(99999999, {error: "Quantity cannot exceed 99,999,999"}),
    productID: z.uuid({error: "Product ID must be a valid UUID" }),
    locationID: z.uuid({error: "Location ID must be a valid UUID" }),
})

export const StatusRequestSchema = z.object({
    name: z.string()
        .min(2, {error: "Status name must be at least 2 characters" })
        .max(50, {error: "Status name must not exceed 50 characters"}),
    description: z.string()
        .max(3000, {error: "Description must not exceed 3000 characters" })
})

export const TransferRequestSchema = z.object({
    date: localDateSchema,
    totalCost: costSchema,
    totalQuantity: z.coerce.number()
        .min(1, {error: "Total Quantity must be positive"})
        .max(10_000, {error: "Total Quantity must not exceed 10,000"}),
    locationToID: z.uuid({error: "Location To ID must be a valid UUID" }),
    locationFromID: z.uuid({error: "Location From ID must be a valid UUID" }),
})

export const TransferItemRequestSchema = z.object({
    cost: costSchema,
    quantity: z.coerce.number()
        .min(1, {error: "Quantity must be positive"})
        .max(10_000, {error: "Quantity must not exceed 10,000"}),
    transferID: z.uuid({error: "Transfer ID must be a valid UUID" }),
    productID: z.uuid({error: "Product ID must be a valid UUID" }),
})

export const VendorRequestSchema = z.object({
    name: z.string()
        .min(2, {error: "Vendor Name must be at least 2 characters" })
        .max(100, {error: "Vendor Name must not exceed 100 characters"}),
    addressLine1: z.string()
        .min(3, {error: "Address must be at least 3 characters" })
        .max(60, {error: "Address must not exceed 60 characters"}).optional(),
    addressLine2: z.string()
        .min(3, {error: "Address must be at least 3 characters" })
        .max(60, {error: "Address must not exceed 60 characters"}).optional(),
    city: z.string()
        .min(2, {error: "City must be at least 2 characters" })
        .max(30, {error: "City must not exceed 30 characters"}).optional(),
    state: z.string()
        .min(2, {error: "State must be exactly 2 characters"})
        .max(2, {error: "State must be exactly 2 characters"}).optional(),
    zipCode: z.string()
        .length(5, {error: "Zip Code must be exactly 5 characters"})
        .regex(/^\d+$/, {error: "Zip Code must contain only digits"}).optional(),
    contactName: z.string()
        .min(2, {error: "Contact Name must be at least 2 characters" })
        .max(60, {error: "Contact Name must not exceed 60 characters"}).optional(),
    phone: z.string()
        .length(10, {error: "Phone number must be exactly 10 digits"})
        .regex(/^\d+$/, {error: "Phone must contain only digits"}).optional(),
    email: z.email({error: "Invalid email address"})
        .min(5, {error: "Email must be at least 5 characters"})
        .max(100, {error: "Email must not exceed 100 characters"})
        .optional()
})