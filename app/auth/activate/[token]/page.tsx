import { activateUserAction } from "@/lib/auth/auth.actions";
import { ActionResult } from "@/lib/utils/api.actions";

interface ActivatePageProps {
    params: Promise<{token: string}>;
}

export default async function ActivatePage({params}: ActivatePageProps) {
    const resolvedParams = await params;
    const token = resolvedParams.token;

    let message: string;
    let status: 'loading' | 'success' | 'error';

    if (!token) {
        status = 'error';
        message = 'Activation token is required.';
    } else {
        try {
            console.log(token)
            const result: ActionResult = await activateUserAction(token);

            if (result.ok) {
                status = 'success';
                message = 'Your account has been successfully activated! You can now log in.';
            } else {
                status = 'error';
                message = result.errors.general ?? 'Activation failed. If the token expired, please try to login to resend the activation email.';
            }
        } catch {
            status = 'error';
            message = 'Activation failed due to a network error.';
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Account Activation</h1>
            <p>{status}: {message}</p>
        </div>
    );
}
