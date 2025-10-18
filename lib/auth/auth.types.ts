import {z} from 'zod';
import { RegisterUserSchema } from "@/lib/auth/auth.schemas";

export type SchemaData<T extends z.ZodTypeAny> = z.infer<T>;

export type TreeifiedError<T extends z.ZodTypeAny> = ReturnType<typeof z.treeifyError> & {
    _schema?: T;
};

export type ValidationResult<T extends z.ZodTypeAny> =
    | { success: true; data: SchemaData<T> }
    | { success: false; error: TreeifiedError<T> };

export type RegisterUserActionResult = ValidationResult<typeof RegisterUserSchema>;