import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/utils/api.actions";

export function handleUnauthorized(result: ActionResult, callbackUrl?: string) {
    if (result.unauthorized) {
        const reason = result.errors?.general === 'Unauthorized'
            ? 'no-session'
            : 'session-expired';
        redirect(`/auth/login?reason=${reason}${callbackUrl ? `&callbackUrl=${callbackUrl}` : ''}`);
    }
}