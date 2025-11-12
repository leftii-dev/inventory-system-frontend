'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ImageButton from '@/components/ImageButton';
import { useSession } from "@/lib/hooks/useSession";
import LoginForm from "@/app/auth/login/LoginForm";
import { UserResponse } from "@/lib/users/users.types";
import { emptyApiResponse } from "@/lib/types/validation.types";
import { logoutAction } from "@/lib/auth/auth.actions";

export default function LoginClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { user, isLoading } = useSession();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const reason = searchParams.get('reason');

    useEffect(() => {
        let hasSignedOut = false;

        const logoutIfExpired = async () => {
            if (
                (reason === 'session-expired' || reason === 'no-session' || reason === 'session-invalid') &&
                user &&
                !hasSignedOut
            ) {
                hasSignedOut = true;
                setLoading(true);

                // Clear the session
                await logoutAction();

                setLoading(false);
            }
        };

        logoutIfExpired();
    }, [reason, user]);

    // Show loading state
    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="max-w-2xl w-full p-10 border border-gray-300 rounded-lg shadow-lg flex flex-col gap-y-2.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 animate-pulse rounded w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    // If already logged in and not handling an expiry, show message
    if (user && !loading && !['session-expired', 'no-session', 'session-invalid'].includes(reason || '')) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center space-y-4">
                    <p>You are already logged in.</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-h-2/3 space-y-10 my-auto max-w-2xl mx-auto flex flex-col justify-center items-center p-10 border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Login</h2>

            {reason === 'session-expired' && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-center w-full" role="alert">
                    <span>Your session has expired. Please log in again.</span>
                </div>
            )}

            {reason === 'no-session' && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded text-center w-full" role="alert">
                    <span>Please log in to continue.</span>
                </div>
            )}

            {reason === 'session-invalid' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center w-full" role="alert">
                    <span>Your session is invalid. Please log in again.</span>
                </div>
            )}

            <LoginForm
                initialData={emptyApiResponse<UserResponse>()}
                callbackUrl={callbackUrl}
            />

            <div className="text-center">OR</div>

            <div className="flex flex-col max-w-48 items-center gap-y-2.5">
                <a href={`${backendUrl}/oauth2/authorization/google`}>
                    <ImageButton
                        src="/images/google_text.svg"
                        alt="Google Logo - Sign in with Google"
                        width={420}
                        height={60}
                    />
                </a>

                <a href={`${backendUrl}/oauth2/authorization/github`}>
                    <ImageButton
                        src="/images/github_text.svg"
                        alt="GitHub Logo - Sign in with GitHub"
                        width={420}
                        height={20}
                    />
                </a>
            </div>
        </div>
    );
}