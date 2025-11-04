'use server';

import {ActionResult, apiAction} from "@/lib/utils/api.actions";
import {SelfUpdateUserSchema} from "@/lib/users/users.schemas";
import {getSession} from "@/app/api/auth/[...nextauth]/route";
import {UserResponse} from "@/lib/users/users.types";

export async function getCurrentUserAction(): Promise<ActionResult<UserResponse>> {
    return await apiAction<UserResponse>({
        endpoint: '/users/me',
        method: 'GET',
        requireAuth: true,
    })
}

// Uses session to retrieve current logged-in user id
export async function updateSelfAction(
    prevState: ActionResult<UserResponse>,
    formData: FormData
): Promise<ActionResult<UserResponse>> {
    const session = await getSession();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }


    return apiAction({
        schema: SelfUpdateUserSchema,
        endpoint: `/users/${session.user.id}`,
        method: 'PUT',
        requireAuth: true,
    }, formData)
}