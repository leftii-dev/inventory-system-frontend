'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

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
            router.push('/dashboard');
        }
    };

    return (
        <div className={`max-h-2/3 mx-auto my-auto flex flex-col justify-center items-center p-6 border border-gray-300 rounded-lg shadow-lg`}>
            <h2>Login</h2>
            <form onSubmit={handleCredentialsLogin}>
                {error && <p className={`text-red-700`}>{error}</p> }

                <input
                    type='text'
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder='Email or Employee ID'
                    required
                />

                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    required
                />
                <button type='submit' className='bg-green-900 text-white'>Login</button>
            </form>

            <div className={`text-center my-5`}>OR</div>

            <a href={`${backendUrl}/oauth2/authorization/google`}>
                <button>Sign in with Google</button>
            </a>

            <a href={`${backendUrl}/oauth2/authorization/github`}>
                <button>Sign in with GitHub</button>
            </a>
        </div>
    )
}