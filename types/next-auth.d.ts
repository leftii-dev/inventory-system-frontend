import 'next-auth';
import 'next-auth/jwt';

/**
 * This is the shape of the user object returned by your backend's
 * /me endpoint or login endpoints.
 */
interface IBackendUser {
    id: string;
    name?: string;
    email?: string;
}

declare module 'next-auth' {
    /**
     * The `user` object available on the client-side session.
     */
    interface Session {
        backendCookie?: string;
        user: {
            id: string;
        } & User;
    }

    /**
     * The `user` object passed from the `authorize` callback to the `jwt` callback.
     * It must match the shape of the user object from your backend.
     */
    type User = IBackendUser & {
        backendCookie?: string;
    };
}

declare module 'next-auth/jwt' {
    /**
     * The JWT payload managed by NextAuth.js. We only need to pass the user's ID through it.
     */
    interface JWT {
        id: string;
        backendCookie?: string;
    }
}
