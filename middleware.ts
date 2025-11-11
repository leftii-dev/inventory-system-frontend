import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface MyToken {
    backendCookie?: string;
    sessionExpiresAt?: string;
}

export async function middleware(req: NextRequest) {
    console.log('🔒 [Middleware] Checking:', req.nextUrl.pathname);

    const token = await getToken({ req }) as MyToken | null;

    // No token
    if (!token) {
        console.log('🔒 [Middleware] No token, redirecting');
        const url = req.nextUrl.clone();
        if(req.method !== 'POST'){
            url.pathname = '/auth/login';
            url.searchParams.set('reason', 'no-session');
            url.searchParams.set('callbackUrl', req.nextUrl.pathname);
        } else {
            return new NextResponse(
                JSON.stringify({ error: 'Session expired' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
        return NextResponse.redirect(url);
    }

    // Expired session
    if (token.sessionExpiresAt && new Date(token.sessionExpiresAt) < new Date()) {
        console.log('🔒 [Middleware] Session expired, redirecting');
        const url = req.nextUrl.clone();
        if(req.method !== 'POST'){
            url.pathname = '/auth/login';
            url.searchParams.set('reason', 'session-expired');
            url.searchParams.set('callbackUrl', req.nextUrl.pathname);
        } else {
            return new NextResponse(
                JSON.stringify({ error: 'Session expired' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
        return NextResponse.redirect(url);
    }

    console.log('🔒 [Middleware] Authorized');
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};