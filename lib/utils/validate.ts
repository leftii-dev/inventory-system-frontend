import { z } from 'zod';
import type {ValidationResult} from '@/lib/types/validation.types';

export function formDataToTypedObject<T>(
    formData: FormData,
    numberFields: string[] = [],
    booleanFields: string[] = [],
    jsonFields: string[] = [],
    nullableFields: string[] = []
): T {
    const obj: Record<string, unknown> = {};

    for (const [key, value] of formData.entries()) {
        const val = value instanceof File ? undefined : value;

        if (nullableFields.includes(key) && (val === "" || val === "null")) {
            obj[key] = null;
            continue;
        }

        if (numberFields.includes(key)) {
            obj[key] = val !== "" ? Number(val) : undefined;
        }
        else if (booleanFields.includes(key)) {
            obj[key] = val === "on" || val === 'true';
        }
        // 2. Add JSON parsing logic
        else if (jsonFields.includes(key)) {
            if (typeof val === 'string' && val.trim() !== '') {
                try {
                    obj[key] = JSON.parse(val);
                } catch (e) {
                    console.error(`Error parsing JSON for field ${key}:`, e);
                    obj[key] = {}; // Default to empty object on failure to prevent Zod crash
                }
            } else {
                obj[key] = {}; // Handle empty strings or undefined
            }
        }
        else {
            obj[key] = val;
        }
    }

    return obj as T;
}


export function validateSchema<T extends z.ZodTypeAny>(
    schema: T,
    data: unknown
): ValidationResult<T> {
    const result = schema.safeParse(data);

    if (!result.success) {
        const errors = z.treeifyError(result.error);
        return {success: false, errors};
    }
    return {success: true, data: result.data};
}

export function extractErrors(
    tree: Record<string, unknown>,
    path: string[] = []
): Record<string, string> {
    const flat: Record<string, string> = {};

    function traverse(obj: unknown, currentPath: string[] = []) {
        if (Array.isArray(obj)) {
            obj.forEach((item) => traverse(item, currentPath));
        } else if (typeof obj === "object" && obj !== null) {
            for (const key in obj) {
                traverse((obj as Record<string, unknown>)[key], currentPath.concat(key));
            }
        } else if (typeof obj === "string") {
            const field = currentPath.find(p => p !== "properties" && p !== "errors") || currentPath.join(".");
            if (flat[field]) {
                flat[field] += ". " + obj; // append additional messages
            } else {
                flat[field] = obj;
            }
        }
    }

    traverse(tree, path);
    return flat;
}