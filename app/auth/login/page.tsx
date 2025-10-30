// /app/auth/login/page.tsx
'use client';

import { signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SubmitButton from "@/components/SubmitButton";
import TextInput from "@/components/TextInput";
import ImageButton from '@/components/ImageButton';
import { useSession } from "next-auth/react";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { status } = useSession();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const reason = searchParams.get('reason');

    useEffect(() => {
        const logoutIfExpired = async () => {
            if (reason === 'session-expired') {
                setLoading(true);
                await signOut({ redirect: false });
                setLoading(false);
            }
        };
        logoutIfExpired();
    }, [reason]);

    if (loading || status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="max-w-2xl w-full p-10 border border-gray-300 rounded-lg shadow-lg flex flex-col gap-y-2.5">
                    <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
                    <div className="h-12 bg-gray-200 animate-pulse rounded w-full"></div>
                    <div className="h-12 bg-gray-200 animate-pulse rounded w-full"></div>
                    <div className="h-12 bg-gray-200 animate-pulse rounded w-full"></div>
                    <div className="h-12 bg-gray-200 animate-pulse rounded w-full"></div>
                    <div className="h-12 bg-gray-200 animate-pulse rounded w-full"></div>
                </div>
            </div>
        );
    }

    if (status === 'authenticated' && !loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-center mt-10">You are already logged in.</p>
            </div>
        );
    }

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const result = await signIn('credentials', {
            redirect: false,
            identifier,
            password,
        });

        console.log(result)

        if (result?.error) {
            setError('Invalid credentials. Please try again.');
        } else {
            router.push(callbackUrl);
        }
    };

    return (
        <div className="max-h-2/3 space-y-10 my-auto max-w-2xl mx-auto flex flex-col justify-center items-center p-10 border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Login</h2>

            {reason === 'session-expired' && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-center w-full" role="alert">
                    <span className="block sm:inline">Your session has expired. Please log in again.</span>
                </div>
            )}

            {reason === 'no-session' && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded text-center w-full" role="alert">
                    <span className="block sm:inline">Please log in to continue.</span>
                </div>
            )}

            <form onSubmit={handleCredentialsLogin} className="flex flex-col min-w-xl items-center gap-y-2.5 w-full">
                {error && <p className="text-red-700">{error}</p>}

                <TextInput
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email or Employee ID"
                    required
                />

                <TextInput
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />

                <div className="flex w-full justify-end">
                    <SubmitButton>
                        Login
                    </SubmitButton>
                </div>
            </form>

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
