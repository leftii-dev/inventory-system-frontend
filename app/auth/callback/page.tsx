// app/auth/callback/page.tsx
import { cookies } from 'next/headers';
import OAuthCallbackClient from './OAuthCallbackClient';

export default async function AuthCallbackPage({
    searchParams
}: {
    searchParams: { error?: string };
}) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('SESSION');

    if(searchParams.error) {
        return (
            <OAuthCallbackClient error={`OAuth error: ${searchParams.error}`} />
        );
    }

    if (!sessionCookie) {
        return <OAuthCallbackClient error="Authentication failed. No session created" />;
    }

    try {
        const res = await fetch(`${process.env.API_URL}/auth/session-status`, {
            headers: {
                Cookie: `SESSION=${sessionCookie.value}`,
            },
            cache: 'no-store',
        });

        if(res.ok) {
            const user = await res.json()
            return <OAuthCallbackClient user={user} />;
        } else {
            return (
                <OAuthCallbackClient error="Failed to verify session" />
            );
        }
    } catch(error) {
        console.error('OAuth callback error:', error);
        return <OAuthCallbackClient error="An unexpected error occurred during authentication" />;
    }
}