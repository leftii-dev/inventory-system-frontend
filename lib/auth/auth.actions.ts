'use server';
import {LoginUserSchema, RegisterUserSchema} from "@/lib/auth/auth.schemas";
import {ActionResult, apiAction} from "@/lib/utils/api.actions";
import {cookies} from "next/headers";
import {UserResponse} from "@/lib/users/users.types"

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

export type UserResponseSession = UserResponse & {backendCookie: string, sessionExpiresAt: string}

export async function loginAction(
    prevState: ActionResult<UserResponse>,
    formData: FormData,
): Promise<ActionResult<UserResponseSession>> {
    const emailOrCode = formData.get('email') as string;

    const result = await apiAction<UserResponse>({
        schema: LoginUserSchema,
        endpoint: /^\d{6}$/.test(emailOrCode) ? '/auth/employee' : '/auth/user',
        method: 'POST',
        requireAuth: false,
    }, formData)
    if (result.ok){
        const backendCookie = result.setCookie
        const sessionExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

        result.response.data = {
            ...result.response.data,
            backendCookie,
            sessionExpiresAt
        } as UserResponseSession;

        if (backendCookie) {
            const cookieStore = await cookies();
            cookieStore.set({
                name: 'SESSION',
                value: backendCookie,
                path: '/',
                httpOnly: true,
                secure: false, // TODO: prod: true
                sameSite: 'lax',
                domain: 'localhost', // TODO: prod: .yourdomain.com
            });
        }
    }
    return result as ActionResult<UserResponseSession>;

}
