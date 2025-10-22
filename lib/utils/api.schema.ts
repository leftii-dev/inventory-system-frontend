import {z} from "zod";


export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
    data: dataSchema,
    message: z.string().nullable().optional(),
    success: z.boolean(),
    timestamp: z.iso.datetime().nullable().optional(),
    validationErrors: z.array(
        z.object({
            field: z.string(),
            message: z.string()
    }).nullable().optional()
    ),
});

export type ApiResponse<T extends z.ZodTypeAny> = z.infer<
    ReturnType<typeof ApiResponseSchema<T>>
>;