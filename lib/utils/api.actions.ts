'use server';

import { z } from 'zod';
import { formDataToTypedObject, validateSchema, extractErrors } from "@/lib/utils/validate";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import type { Dispatcher } from "undici-types";

type HttpMethod = Dispatcher.HttpMethod;
type SafeHttpMethod = HttpMethod | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type ActionResultWithSchema<T extends z.ZodTypeAny> =
    | { success: true; data: z.infer<T> }
    | { success: false; errors: Record<string, string> };

type ActionResultNoSchema =
    | { success: true; data: Record<string, unknown> }
    | { success: false; errors: Record<string, string> };


export type ActionResult<T extends z.ZodTypeAny | undefined = undefined> =
    T extends z.ZodTypeAny ? ActionResultWithSchema<T> : ActionResultNoSchema;

type BaseOptions = {
    endpoint: string;
    method?: SafeHttpMethod;
    numberFields?: string[];
    booleanFields?: string[];
    requireAuth?: boolean;
};

type SchemaOptions<T extends z.ZodTypeAny> = BaseOptions & {
    schema: T;
    extraData?: Partial<z.infer<T>>;
};

type NoSchemaOptions = BaseOptions & {
    schema?: undefined;
    extraData?: Record<string, unknown>;
};

// Overloads
export async function apiAction<T extends z.ZodTypeAny>(
    options: SchemaOptions<T>,
    formData?: FormData
): Promise<ActionResultWithSchema<T>>;

export async function apiAction(
    options: NoSchemaOptions,
    formData?: FormData
): Promise<ActionResultNoSchema>;

// Implementation
export async function apiAction<T extends z.ZodTypeAny>(
    options: SchemaOptions<T> | NoSchemaOptions,
    formData?: FormData
): Promise<ActionResultWithSchema<T> | ActionResultNoSchema> {
    const {
        schema,
        endpoint,
        method = 'POST',
        numberFields = [],
        booleanFields = [],
        requireAuth = true,
        extraData = {},
    } = options;

    if (requireAuth) {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { success: false, errors: { general: 'Unauthorized' } };
        }
    }

    let bodyData: Record<string, unknown>;

    if (schema && formData) {
        const input = formDataToTypedObject(formData, numberFields, booleanFields);
        const validation = validateSchema(schema, input);

        if (!validation.success) {
            return { success: false, errors: extractErrors(validation.errors) };
        }

        bodyData = { ...(validation.data as Record<string, unknown>), ...extraData };
    } else {
        bodyData = { ...extraData };
    }

    try {
        const response = await fetch(`${process.env.API_URL}${endpoint}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: ['GET', 'DELETE'].includes(method) ? undefined : JSON.stringify(bodyData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { success: false, errors: { general: errorData.message || 'Request failed' } };
        }

        return { success: true, data: bodyData };
    } catch (err: unknown) {
        return { success: false, errors: { general: (err as Error).message || 'Network error' } };
    }
}
