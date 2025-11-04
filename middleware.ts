import { withAuth } from "next-auth/middleware";

interface MyToken {
    backendCookie?: string;
    sessionExpiresAt?: string;
    invalidated?: boolean;
}

export default withAuth({
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        authorized: ({ token, req }) => {
            const t = token as MyToken | undefined;

            console.log('MiddleWare: token', token)
            // No token → no-session
            if (!t) {
                console.log('MiddleWare: No Token')
                const url = req.nextUrl.clone();
                url.pathname = '/auth/login';
                url.searchParams.set('reason', 'no-session');
                url.searchParams.set('callbackUrl', req.nextUrl.pathname);
                return false;
            }

            // Expired backend session → session-expired
            if (t.sessionExpiresAt && new Date(t.sessionExpiresAt) < new Date()) {
                console.log('MiddleWare: Session expired');
                const url = req.nextUrl.clone();
                url.pathname = '/auth/login';
                url.searchParams.set('reason', 'session-expired');
                url.searchParams.set('callbackUrl', req.nextUrl.pathname);
                return false;
            }

            return true;
        },
    },
});

export const config = {
    matcher: ["/dashboard/:path*"],
};
