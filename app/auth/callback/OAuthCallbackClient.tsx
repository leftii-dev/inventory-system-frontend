'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Props {
    user?: {
        id: string;
        email: string;
        name: string;
        [key: string]: unknown;
    };
    backendCookie?: string;
    sessionExpiresAt?: string;
    error?: string;
}

export default function OAuthCallbackClient({ user, backendCookie, sessionExpiresAt, error }: Props) {
    const router = useRouter();
    const [localError, setLocalError] = useState<string | null>(error || null);

    useEffect(() => {
        if (error || !user) {
            return;
        }

        const finalizeSession = async () => {
            try {
                const payload = JSON.stringify({
                    ...user,
                    backendCookie,
                    sessionExpiresAt,
                });

                const result = await signIn('credentials', {
                    userJSON: payload,
                    redirect: false,
                });

                if (result?.ok) {
                    router.push('/dashboard');
                } else {
                    setLocalError('Failed to create session');
                }
            } catch (err) {
                console.error('Failed to finalize OAuth session:', err);
                setLocalError('An unexpected error occurred');
            }
        };

        finalizeSession();
    }, [user, backendCookie, sessionExpiresAt, error, router]);

    if (localError) {
        return (
            <div className="max-w-xl mx-auto p-8 mt-20 border border-gray-300 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-bold mb-4">Authentication Failed</h2>
                <p className="mb-4">{localError}</p>
                <a href="/auth/login" className="text-blue-600 underline">
                    Return to Login
                </a>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-8 mt-20 border border-gray-300 rounded-lg shadow-lg text-center">
            <p>Finalizing your login... Please wait.</p>
        </div>
    );
}