import NextAuth, { AuthOptions, getServerSession, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { parseSetCookieExpiry } from "@/lib/auth/cookie";
import { JWT } from 'next-auth/jwt';

interface MyToken extends JWT {
    sessionExpiresAt?: string; // ISO string of backend session expiry
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                userJSON: { type: 'hidden' },
            },
            async authorize(credentials) {
                if (!credentials?.userJSON) return null;
                try {
                    const user = JSON.parse(credentials.userJSON);
                    if (user && user.id) return user;
                } catch {
                    return null;
                }
                return null;
            },
        }),
    ],

    session: {
        strategy: 'jwt',
    },

    callbacks: {
        async jwt({ token, user }) {
            const t = token as MyToken;

            // On first login, store sessionExpiresAt and user info
            if (user) {
                const backendUser = user as User & { sessionExpiresAt?: string };
                t.sessionExpiresAt = backendUser.sessionExpiresAt;
                t.id = backendUser.id;
                t.name = backendUser.name;
                t.email = backendUser.email;
            }

            // Optional: refresh the backend session if it's close to expiring
            if (t.sessionExpiresAt) {
                const expiryTime = new Date(t.sessionExpiresAt).getTime();
                const now = Date.now();
                const timeLeft = expiryTime - now;

                // Refresh 2 minutes before expiry
                if (timeLeft < 2 * 60 * 1000) {
                    try {
                        const res = await fetch(`${process.env.API_URL}/auth/refresh-session`, {
                            method: 'GET',
                            credentials: 'include',
                        });

                        if (res.ok) {
                            const newCookie = res.headers.get('set-cookie') ?? res.headers.get('Set-Cookie');
                            const newExpiry = parseSetCookieExpiry(newCookie ?? undefined);
                            if (newExpiry) {
                                t.sessionExpiresAt = newExpiry.toISOString();
                            }
                        }
                    } catch (err) {
                        console.error('Failed to refresh backend session:', err);
                        // Don't invalidate token; just leave expiry as is
                    }
                }
            }

            return t;
        },

        async session({ session, token }) {
            const t = token as MyToken;

            // Map JWT fields to session
            if (session.user) {
                session.user.id = t.id as string;
                session.user.name = t.name as string;
                session.user.email = t.email as string;
            }
            session.sessionExpiresAt = t.sessionExpiresAt;

            return session;
        },
    },

    pages: {
        signIn: '/auth/login',
    },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

export async function getSession() {
    return await getServerSession(authOptions);
}
