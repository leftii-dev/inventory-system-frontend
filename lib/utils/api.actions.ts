// lib/utils/api.actions.ts
'use server';

import { z } from 'zod';
import { formDataToTypedObject, validateSchema, extractErrors } from "@/lib/utils/validate";
import { getSession } from "@/app/api/auth/[...nextauth]/route";
import type { Dispatcher } from "undici-types";
import {ApiResponseDto, emptyApiResponse} from "@/lib/types/validation.types";
import {cookies} from "next/headers";

type HttpMethod = Dispatcher.HttpMethod;
type SafeHttpMethod = HttpMethod | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const isServer = typeof window === 'undefined';

export type ActionResult<D = unknown> = {
    ok: boolean;
    response: ApiResponseDto<D>;
    errors: Record<string, string>;
    unauthorized?: boolean;
    setCookie?: string;
    sessionExtended?: boolean; // New flag
};

type Options = {
    endpoint: string;
    method?: SafeHttpMethod;
    numberFields?: string[];
    booleanFields?: string[];
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
        requireAuth = false,
        extraData = {},
    } = options;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (requireAuth) {
        const session = await getSession();
        if (!session) {
            return {
                ok: false,
                response: emptyApiResponse<D>(),
                errors: { general: 'Unauthorized' },
                unauthorized: true,
            };
        }

        if (isServer) {
            const cookieStore = await cookies()
            const backendCookie = cookieStore.get('SESSION')?.value as string
            headers['Cookie'] = `SESSION=${backendCookie}`;
        }
    }

    let bodyData: Record<string, unknown>;
    if (schema && formData) {
        const input = formDataToTypedObject(formData, numberFields, booleanFields);
        const validation = validateSchema(schema, input);

        if (!validation.success) {
            return {
                ok: false,
                response: emptyApiResponse<D>(),
                errors: extractErrors(validation.errors) };
        }
        bodyData = { ...(validation.data as Record<string, unknown>), ...extraData };
    } else {
        bodyData = { ...extraData };
    }

    try {
        const response = await fetch(`${process.env.API_URL}${endpoint}`, {
            method,
            headers,
            credentials: isServer ? undefined : 'include',
            body: ['GET', 'DELETE'].includes(method) ? undefined : JSON.stringify(bodyData),
        });

        // Failed Request Unauthorized
        if (response.status === 401 || response.status === 403) {
            console.error(response);
            return {
                ok: false,
                response: emptyApiResponse<D>(),
                errors: { general: 'Session expired' },
                unauthorized: true,
            };
        }

        // Failed Request
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                ok: false,
                response: emptyApiResponse<D>(),
                errors: { general: errorData.message || `Request failed with status ${response.status}` },
            };
        }

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

        const rawCookie = response.headers.get('set-cookie') ?? response.headers.get('Set-Cookie');
        const stripSetCookie = rawCookie?.match(/SESSION=([^;]+)/)?.[1];

        // Mark that session was likely extended by Spring
        const sessionExtended = requireAuth && response.ok;

        return {
            ok: true,
            response: json,
            setCookie: stripSetCookie,
            errors: {} as Record<string, string>,
            sessionExtended,
        };

    } catch (err: unknown) {
        return {
            ok: false,
            response: emptyApiResponse<D>(),
            errors: { general: (err as Error).message || 'Network error' },
        };
    }
}