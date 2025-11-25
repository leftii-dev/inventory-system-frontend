// lib/utils/api.actions.ts
'use server';

import { z } from 'zod';
import { formDataToTypedObject, validateSchema, extractErrors } from "@/lib/utils/validate";
import { getSession } from "@/lib/auth/session";
import type { Dispatcher } from "undici-types";
import { ApiResponseDto, emptyApiResponse } from "@/lib/types/validation.types";
import { cookies } from "next/headers";

type HttpMethod = Dispatcher.HttpMethod;
type SafeHttpMethod = HttpMethod | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type ActionResult<D = unknown> = {
    ok: boolean;
    response: ApiResponseDto<D>;
    errors: Record<string, string>;
    unauthorized?: boolean;
    setCookie?: string;
};

type Options = {
    endpoint: string;
    method?: SafeHttpMethod;
    numberFields?: string[];
    booleanFields?: string[];
    jsonFields?: string[];
    nullableFields?: string[];
    requireAuth?: boolean;
    schema?: z.ZodTypeAny;
    extraData?: Record<string, unknown>;
};

export async function apiAction<D = unknown>(
    options: Options,
    formData?: FormData
): Promise<ActionResult<D>> {
    const {
        schema,
        endpoint,
        method = 'GET',
        numberFields = [],
        booleanFields = [],
        jsonFields = [],
        nullableFields = [],
        requireAuth = false,
        extraData = {},
    } = options;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const session = await getSession();

    // Handle authentication
    if (requireAuth && !session) {
        return {
            ok: false,
            response: emptyApiResponse<D>(),
            errors: { general: 'Unauthorized' },
            unauthorized: true,
        };
    }

    if(session) {
        // Get the SESSION cookie to forward to backend
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('SESSION')?.value;

        if (sessionCookie) {
            headers['Cookie'] = `SESSION=${sessionCookie}`;
        } else if (requireAuth) {
            return {
                ok: false,
                response: emptyApiResponse<D>(),
                errors: { general: 'No session cookie found' },
                unauthorized: true,
            };
        }
    }

    // Validate and prepare body data
    let bodyData: Record<string, unknown>;
    if (schema && formData) {
        const input = formDataToTypedObject(formData, numberFields, booleanFields, jsonFields, nullableFields);
        const validation = validateSchema(schema, input);

        if (!validation.success) {
            return {
                ok: false,
                response: emptyApiResponse<D>(),
                errors: extractErrors(validation.errors)
            };
        }
        bodyData = { ...(validation.data as Record<string, unknown>), ...extraData };
    } else {
        bodyData = { ...extraData };
    }

    try {
        const response = await fetch(`${process.env.API_URL}${endpoint}`, {
            method,
            headers,
            cache: 'no-store', // Don't cache authenticated requests
            body: ['GET', 'DELETE'].includes(method) ? undefined : JSON.stringify(bodyData),
        });

        // Handle unauthorized
        if (response.status === 401 || response.status === 403) {
            console.error('Unauthorized request:', response.status);
            return {
                ok: false,
                response: emptyApiResponse<D>(),
                errors: { general: 'Session expired' },
                unauthorized: true,
            };
        }

        // Handle other errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                ok: false,
                response: emptyApiResponse<D>(),
                errors: { general: errorData.message || `Request failed with status ${response.status}` },
            };
        }

        // Parse response
        let json: ApiResponseDto<D>;

        const contentType = response.headers.get('content-type');
        const hasJsonContent = contentType && contentType.includes('application/json');

        if (response.status === 204 || !hasJsonContent) {
            json = {
                data: undefined as D,
                message: 'Success',
                success: true,
                timestamp: new Date().toISOString(),
                validationErrors: []
            } as ApiResponseDto<D>;
        } else {
            const text = await response.text();
            json = text ? JSON.parse(text) : emptyApiResponse<D>();
        }

        // Extract SESSION cookie if backend sent an updated one
        const rawCookie = response.headers.get('set-cookie') ?? response.headers.get('Set-Cookie');
        const stripSetCookie = rawCookie?.match(/SESSION=([^;]+)/)?.[1];

        return {
            ok: true,
            response: json,
            setCookie: stripSetCookie,
            errors: {} as Record<string, string>,
        };

    } catch (err: unknown) {
        console.error('API Action error:', err);
        return {
            ok: false,
            response: emptyApiResponse<D>(),
            errors: { general: (err as Error).message || 'Network error' },
        };
    }
}