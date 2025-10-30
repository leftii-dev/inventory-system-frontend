'use server';

import {ActionResult, apiAction} from "@/lib/utils/api.actions";
import {SelfUpdateUserSchema} from "@/lib/users/users.schemas";
import {getSession} from "@/app/api/auth/[...nextauth]/route";

export async function getCurrentUserAction(): Promise<ActionResult> {
    return apiAction({
        endpoint: '/users/me',
        method: 'GET',
        requireAuth: true,
    })
}

// Uses session to retrieve current logged-in user id
export async function updateSelfAction(
    prevState: ActionResult<typeof SelfUpdateUserSchema>,
    formData: FormData
): Promise<ActionResult<typeof SelfUpdateUserSchema>> {
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