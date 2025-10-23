'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SubmitButton from "@/components/SubmitButton";
import TextInput from "@/components/TextInput";
import ImageButton from '@/components/ImageButton';
import { useSession} from "next-auth/react";

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {data: session} = useSession();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const callbackUrl = useSearchParams().get('callbackUrl') || '/dashboard';

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const result = await signIn('credentials', {
            redirect: false,
            identifier,
            password,
        });

        if (result?.error) {
            setError('Invalid credentials. Please try again.');
        } else {
            router.push(callbackUrl);
        }
    };

    if (session) {
        return(
            <div>
                <p className={`text-center mt-10`}>You are already logged in.</p>
            </div>
        )
    }

    return (
        <div className={`max-h-2/3 space-y-10 my-auto max-w-2xl mx-auto flex flex-col justify-center items-center p-10 border border-gray-300 rounded-lg shadow-lg`}>
            <h2 className={`text-xl font-bold mb-2`}>Login</h2>
            <form
                onSubmit={handleCredentialsLogin}
                className={`flex flex-col min-w-xl items-center gap-y-2.5`}
            >
                {error && <p className={`text-red-700`}>{error}</p> }

                <TextInput
                    type={`text`}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={`Email or Employee ID`}
                    required={true} />

                <TextInput
                    type={`password`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={`Password`}
                    required={true} />

                <div className={`flex w-full justify-end`}>
                    <SubmitButton>
                        Login
                    </SubmitButton>
                </div>
                
            </form>

            <div className={`text-center`}>OR</div>

            <div className={`flex flex-col max-w-48 items-center gap-y-2.5`}>
                <a className={``}
                   href={`${backendUrl}/oauth2/authorization/google`}>
                    <ImageButton
                        src={`/images/google_text.svg`}
                        alt={`Google Logo - Sign in with Google`}
                        width={420}
                        height={60}/>
                </a>

                <a className={``}
                   href={`${backendUrl}/oauth2/authorization/github`}>
                    <ImageButton
                        src={`/images/github_text.svg`}
                        alt={`GitHub Logo - Sign in with GitHub`}
                        width={420}
                        height={20}/>
                </a>
            </div>
        </div>
    )
}