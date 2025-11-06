import { z } from 'zod';

export type TreeifiedError<T extends z.ZodTypeAny> = ReturnType<typeof z.treeifyError> & {
    _schema?: T;
};

export type ValidationResult<T extends z.ZodTypeAny> =
    | { success: true; data: z.infer<T> }
    | { success: false; errors: TreeifiedError<T> };


export type ApiResponseDto<T = unknown> = {
    success: boolean;
    message: string;
    timestamp: string;
    data: T;
    validationErrors: Record<string, string>[];
};



export function emptyApiResponse<T>(): ApiResponseDto<T> {
    return {
        success: false,
        message: "",
        timestamp: new Date().toISOString(),
        data: {} as T,
        validationErrors: [],
    };
}

export type BigDecimalLike = string | number;
