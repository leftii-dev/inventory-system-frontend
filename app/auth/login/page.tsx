// /app/auth/login/page.tsx
'use client';

import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {useSearchParams } from 'next/navigation';
import ImageButton from '@/components/ImageButton';
import { useSession } from "next-auth/react";
import LoginForm from "@/app/auth/login/LoginForm";
import {UserResponseSession} from "@/lib/auth/auth.actions";
import {emptyApiResponse} from "@/lib/types/validation.types";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const { status } = useSession();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const callbackUrl = searchParams.get('callbackUrl') || '/';
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

            <LoginForm
                initialData ={emptyApiResponse<UserResponseSession>()}
                callbackUrl = {callbackUrl}
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
