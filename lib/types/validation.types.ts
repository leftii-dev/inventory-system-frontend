import { z } from 'zod';

export type TreeifiedError<T extends z.ZodTypeAny> = ReturnType<typeof z.treeifyError> & {
    _schema?: T;
};

export type ValidationResult<T extends z.ZodTypeAny> =
    | { success: true; data: z.infer<T> }
    | { success: false; errors: TreeifiedError<T> };