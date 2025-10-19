'use server';

import { z } from 'zod';
import { formDataToTypedObject, validateSchema, extractErrors } from "@/lib/utils/validate";

import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {getServerSession} from "next-auth";
import type {Dispatcher} from "undici-types";
type HttpMethod = Dispatcher.HttpMethod;

type SafeHttpMethod = HttpMethod | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type ActionResult<T extends z.ZodTypeAny> =
    | { success: true; data: z.infer<T> }
    | { success: false; errors: Record<string, string> };

type GenericApiActionOptions<T extends z.ZodTypeAny> = {
    schema: T;
    endpoint: string;
    method?: SafeHttpMethod;
    numberFields?: string[];
    booleanFields?: string[];
    requireAuth?: boolean;
    extraData?: Record<string, unknown>
}

export async function apiAction<T extends z.ZodTypeAny>(
    formData: FormData,
    options: GenericApiActionOptions<T>
): Promise<ActionResult<T>> {
    const {
        schema,
        endpoint,
        method = 'POST',
        numberFields = [],
        booleanFields = [],
        requireAuth = true,
        extraData = {}
    } = options;

    if(requireAuth) {
        const session = await getServerSession(authOptions);
        if(!session) {
            return { success: false, errors: { general: 'Unauthorized' } };
        }
    }

    const input = formDataToTypedObject<z.infer<T>>(formData, numberFields, booleanFields);

    const validation = validateSchema(schema, input);
    if (!validation.success) {
        return { success: false, errors: extractErrors(validation.errors) };
    }

    const bodyData = Object.assign({}, validation.data, extraData);



    try {
        const response = await fetch(`${process.env.API_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: ['GET', 'DELETE'].includes(method)
                ? undefined
                : JSON.stringify(bodyData),
        });

        if(!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { success: false, errors: { general: errorData.message || 'Request failed' } };
        }

        return { success: true, data: bodyData };
    } catch (err: unknown) {
        return {success: false, errors: { general: (err as Error).message || 'Network error' } };
    }
}
