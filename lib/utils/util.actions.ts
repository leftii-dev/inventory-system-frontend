import {ActionResult, apiAction} from "@/lib/utils/api.actions";

// Util function for protected routes - triggers middleware
export async function pingAction():Promise<ActionResult> {
    return apiAction({
            endpoint: '/auth/ping',
            method: 'POST',
            requireAuth: true
        });
}