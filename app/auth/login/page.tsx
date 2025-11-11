import { Suspense } from 'react';
import LoginClient from './LoginClient';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading login...</div>}>
            <LoginClient />
        </Suspense>
    );
}
