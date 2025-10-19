'use server';

import { RegisterUserSchema } from "@/lib/auth/auth.schemas";
import {ActionResult, apiAction} from "@/lib/utils/api.actions";

export async function registerUserAction(formData: FormData): Promise<ActionResult<typeof RegisterUserSchema>> {
    return apiAction(formData, {
        schema: RegisterUserSchema,
        endpoint: '/auth/register',
        method: 'POST',
        requireAuth: false, // Registration does not require prior authentication
        extraData: { roles: ['SHOPPER']} // Default role assignment, lowest privilege
    });
}