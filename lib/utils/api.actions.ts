'use server';

import { z } from 'zod';
import { formDataToTypedObject, validateSchema, extractErrors } from "@/lib/utils/validate";
import { getSession } from "@/app/api/auth/[...nextauth]/route";
import type {Dispatcher, RequestCredentials} from "undici-types";


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

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    let credentials: RequestCredentials | undefined = undefined;

    if (requireAuth) {
        const session = await getSession();
        if (!session) {
            return { success: false, errors: { general: 'Unauthorized' } };
        } else {
            if(session.backendCookie) {
                headers['Cookie'] = session.backendCookie;
            } else {
                credentials = 'include';
            }
        }
    }

    let bodyData: Record<string, unknown>;

    if (schema && formData) {
        const input = formDataToTypedObject(formData, numberFields, booleanFields);
        const validation = validateSchema(schema, input);


        if (!validation.success) {
            return { success: false, errors: extractErrors(validation.errors) };
        }
        console.log(validation.data);

        bodyData = { ...(validation.data as Record<string, unknown>), ...extraData };
    } else {
        bodyData = { ...extraData };
    }

    try {
        const response = await fetch(`${process.env.API_URL}${endpoint}`, {
            method,
            headers,
            credentials,
            body: ['GET', 'DELETE'].includes(method) ? undefined : JSON.stringify(bodyData),
        });
        console.log('API Response:');
        console.log(response);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.log('API Error:');
            console.log(response);
            return { success: false, errors: { general: errorData.message || 'Request failed' } };
        }
        const json = await response.json();

        return { success: true, ...json };
    } catch (err: unknown) {
        return { success: false, errors: { general: (err as Error).message || 'Network error' } };
    }
}
