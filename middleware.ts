// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    console.log('🔒 [Middleware] Checking:', req.nextUrl.pathname);

    // Get the SESSION cookie
    const sessionCookie = req.cookies.get('SESSION')?.value;

    if (!sessionCookie) {
        console.log('🔒 [Middleware] No session cookie, redirecting');
        return handleUnauthorized(req, 'no-session');
    }

    // Verify session with backend
    try {
        const res = await fetch(`${process.env.API_URL}/auth/session-status`, {
            method: 'GET',
            headers: {
                'Cookie': `SESSION=${sessionCookie}`,
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            console.log('🔒 [Middleware] Invalid session, redirecting');
            return handleUnauthorized(req, 'session-invalid');
        }

        console.log('🔒 [Middleware] Authorized');
        return NextResponse.next();

    } catch (error) {
        console.error('🔒 [Middleware] Session check failed:', error);
        return handleUnauthorized(req, 'session-error');
    }
}

function handleUnauthorized(req: NextRequest, reason: string) {
    // For POST requests (form submissions, API calls), return 401
    if (req.method === 'POST') {
        return new NextResponse(
            JSON.stringify({ error: 'Session expired' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // For GET requests, redirect to login
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('reason', reason);
    url.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ["/dashboard/:path*"],
};