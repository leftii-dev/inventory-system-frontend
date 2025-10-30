'use server';
import {LoginUserSchema, RegisterUserSchema} from "@/lib/auth/auth.schemas";
import {ActionResult, apiAction} from "@/lib/utils/api.actions";
import {signIn} from "next-auth/react";

export async function registerUserAction(formData: FormData): Promise<ActionResult<typeof RegisterUserSchema>> {
    return apiAction({
        schema: RegisterUserSchema,
        endpoint: '/auth/register',
        method: 'POST',
        requireAuth: false, // Registration does not require prior authentication
        extraData: { roles: ['SHOPPER']} // Default role assignment, lowest privilege
    }, formData);
}

export async function activateUserAction(token: string): Promise<ActionResult> {
    console.log(token)
    console.log(encodeURIComponent(token));
    return apiAction({
        endpoint: '/auth/activate/' + encodeURIComponent(token),
        method: 'POST',
        requireAuth: false, // Activation does not require prior authentication
    })
}

export async function loginAction(
    prevState: ActionResult<typeof LoginUserSchema>,
    formData: FormData,
): Promise<ActionResult<typeof LoginUserSchema>> {
    const emailOrCode = formData.get('email') as string;
    return apiAction({
        schema: LoginUserSchema,
        endpoint: /^\d{6}$/.test(emailOrCode) ? '/auth/employee' : '/auth/user',
        method: 'POST',
        requireAuth: false,
    }, formData)
}
