import { z } from 'zod';
import type {ValidationResult} from '@/lib/types/validation.types';

export function formDataToTypedObject<T>(
    formData: FormData,
    numberFields: string[] = [],
    booleanFields: string[] = []
): T {
    const obj: Record<string, unknown> = {};

    for (const [key, value] of formData.entries()) {
        const val = value instanceof File ? undefined : value;

        if (numberFields.includes(key)) {
            obj[key] = val !== "" ? Number(val) : undefined;
        } else if (booleanFields.includes(key)) {
            obj[key] = val === "true";
        } else {
            obj[key] = val; // string or undefined
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