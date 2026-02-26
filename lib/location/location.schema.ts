import { z } from "zod";
import {localTimeSchema} from "@/lib/utils/util.schema";

export const LocationDetailsRequestSchema = z.object({
    addressLine1: z.string()
        .max(60, {error: "Address must not exceed 60 characters"}).optional(),
    addressLine2: z.string()
        .max(60, {error: "Address must not exceed 60 characters"}).optional(),
    city: z.string().max(30, {error: "City must not exceed 30 characters"}).optional(),
    state: z.string().length(2, {error: "State must be exactly 2 characters"}).optional(),
    zipCode: z.string().length(5, {error: "Zip Code must be exactly 5 characters"})
        .regex(/^\d+$/, {error: "Zip Code must contain only digits"}).optional(),
    phone: z.string().length(10, {error: "Phone number must be exactly 10 digits"})
        .regex(/^\d+$/, {error: "Phone must contain only digits"}).optional(),
    fax: z.string().length(10, {error: "Fax number must be exactly 10 digits"})
        .regex(/^\d+$/, {error: "Fax must contain only digits"}).optional(),
    email: z.email({error: "Invalid email address"})
        .min(5, {error: "Email must be at least 5 characters"})
        .max(120, {error: "Email must not exceed 120 characters"}).optional(),
    notes: z.string().max(3000, {error: "Notes must not exceed 3000 characters"}).optional(),
    locationID: z.uuid({error: "Location ID must be a valid UUID" }).optional(),
    managerID: z.uuid({error: "Manager ID must be a valid UUID" }).optional(),
})

export const dayOfWeekSchema = z.coerce
    .number()
    .int("Day of week must be an integer (0-6)")
    .min(0, {error: "Day of week cannot be less than 0 (Sunday)"})
    .max(6, {error: "Day of week cannot be greater than 6 (Saturday)"});

export const LocationHoursRequestSchema = z.object({
    dayOfWeek: dayOfWeekSchema,
    openTime: localTimeSchema,
    closeTime: localTimeSchema,
    locationID: z.uuid({error: "Location ID must be a valid UUID" }),
})

export const RetailLocationRequestSchema = z.object({
    locationID: z.uuid({error: "Location ID must be a valid UUID" }),
})

export const WarehouseLocationRequestSchema = z.object({
    locationID: z.uuid({error: "Location ID must be a valid UUID" }),
})

export const LocationTypeRequestSchema = z.object({
    name: z.string()
        .min(1, {error: "Location type name cannot be blank"})
        .max(50, {error: "Location type name must not exceed 50 characters"}),
})

export const LocationRequestSchema = z.object({
    name: z.string()
        .max(100, {error: "Location name must not exceed 100 characters"}),
    locationTypeID: z.uuid({error: "Location Type ID must be a valid UUID" }),
})