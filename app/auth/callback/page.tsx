// app/auth/callback/page.tsx
import { cookies } from 'next/headers';
import OAuthCallbackClient from './OAuthCallbackClient';

export default async function AuthCallbackPage() {
    const cookieStore = await cookies();

    console.log('=== OAuth Callback Debug ===');

    const sessionCookie = cookieStore.get('SESSION');
    console.log('1. SESSION cookie from browser:', sessionCookie);

    if (!sessionCookie) {
        console.error('❌ No SESSION cookie found');
        return <OAuthCallbackClient error="Session cookie not found. OAuth may have failed." />;
    }

    const cookieValue = `SESSION=${sessionCookie.value}`;
    console.log('2. Using cookie:', cookieValue);

    try {
        console.log('3. Fetching from:', `${process.env.API_URL}/users/me`);

        const res = await fetch(`${process.env.API_URL}/users/me`, {
            headers: {
                Cookie: cookieValue,
            },
            cache: 'no-store',
        });

        console.log('4. Backend response status:', res.status);

        if (!res.ok) {
            console.error('❌ Backend request failed with status:', res.status);
            const errorText = await res.text();
            console.error('Error response:', errorText);
            return <OAuthCallbackClient error={`Backend returned status ${res.status}`} />;
        }

        const apiResponse = await res.json();
        console.log('5. API Response:', apiResponse);

        const user = apiResponse.data;

        if (!user) {
            console.error('❌ User data not found in response');
            return <OAuthCallbackClient error="User data not found" />;
        }

        console.log('6. User extracted:', user);

        const sessionExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

        console.log('7. Session expires at:', sessionExpiresAt.toISOString());

        console.log('=== Passing to client component ===');
        console.log('User:', user);
        console.log('Backend Cookie:', cookieValue);
        console.log('Session Expires:', sessionExpiresAt.toISOString());

        return (
            <OAuthCallbackClient
                user={user}
                backendCookie={cookieValue}
                sessionExpiresAt={sessionExpiresAt.toISOString()}
            />
        );
    } catch (err) {
        console.error('❌ Auth callback failed:', err);
        console.error('Error stack:', err instanceof Error ? err.stack : 'No stack');
        return <OAuthCallbackClient error="An unexpected error occurred" />;
    }
}