'use server';
import {LoginUserSchema, RegisterUserSchema} from "@/lib/auth/auth.schemas";
import {ActionResult, apiAction} from "@/lib/utils/api.actions";
import {cookies} from "next/headers";
import {UserResponse} from "@/lib/users/users.types"
import { revalidatePath } from 'next/cache';

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
    return apiAction({
        endpoint: '/auth/activate/' + encodeURIComponent(token),
        method: 'POST',
        requireAuth: false, // Activation does not require prior authentication
    })
}


export async function loginAction(
    prevState: ActionResult<UserResponse>,
    formData: FormData,
): Promise<ActionResult<UserResponse>> {
    const emailOrCode = formData.get('email') as string;

    const result = await apiAction<UserResponse>({
        schema: LoginUserSchema,
        endpoint: /^\d{6}$/.test(emailOrCode) ? '/auth/employee' : '/auth/user',
        method: 'POST',
        requireAuth: false,
    }, formData);

    if (result.ok) {
        const backendCookie = result.setCookie;

        // Set the SESSION cookie
        if (backendCookie) {
            const cookieStore = await cookies();
            cookieStore.set({
                name: 'SESSION',
                value: backendCookie,
                path: '/',
                httpOnly: true,
                secure: false, // TODO: prod: true
                sameSite: 'lax',
                // No domain — defaults to the current host, which is required for localhost
            });
        }
    }

    return result;
}



export async function logoutAction() {
    const cookieStore = await cookies();

    // Call backend logout
    const sessionCookie = cookieStore.get('SESSION')?.value;
    if (sessionCookie) {
        try {
            await fetch(`${process.env.API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Cookie': `SESSION=${sessionCookie}`,
                },
            });
        } catch (error) {
            console.error('Backend logout failed:', error);
        }
    }

    // Delete the cookie
    cookieStore.delete('SESSION');

    // Revalidate all pages
    revalidatePath('/', 'layout');
}