import { z } from 'zod';
import type {ValidationResult} from '@/lib/types/validation.types';

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