'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/hooks/useSession';

interface Props {
    user?: {
        id: string;
        email: string;
        name: string;
        [key: string]: unknown;
    };
    error?: string;
}

export default function OAuthCallbackClient({ user, error }: Props) {
    const router = useRouter();
    const { mutate } = useSession();
    const [localError, setLocalError] = useState<string | null>(error || null);

    useEffect(() => {
        if (error || !user) {
            return;
        }

        const finalizeSession = async () => {
            try {
                // The SESSION cookie is already set by the server-side OAuth handler
                // Just need to refresh the client-side session cache
                await mutate();

                // Redirect to dashboard
                router.push('/dashboard');
            } catch (err) {
                console.error('Failed to finalize OAuth session:', err);
                setLocalError('An unexpected error occurred');
            }
        };

        finalizeSession();
    }, [user, error, router, mutate]);

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