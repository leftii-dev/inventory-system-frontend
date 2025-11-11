// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions, getServerSession, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { parseSetCookieExpiry } from "@/lib/auth/cookie";
import { JWT } from 'next-auth/jwt';
import { cookies } from 'next/headers';

interface MyToken extends JWT {
    sessionExpiresAt?: string;
    lastChecked?: number; // Track when we last checked the backend
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
        maxAge: 30 * 60, // 30 minutes (match your Spring session timeout)
    },

    callbacks: {
        async jwt({ token, user, trigger }) {
            const t = token as MyToken;

            // On first login, store sessionExpiresAt and user info
            if (user) {
                const backendUser = user as User & { sessionExpiresAt?: string };
                t.sessionExpiresAt = backendUser.sessionExpiresAt;
                t.id = backendUser.id;
                t.name = backendUser.name;
                t.email = backendUser.email;
                t.lastChecked = Date.now();
            }

            // On manual update trigger or periodic checks
            if (trigger === 'update' || shouldCheckBackend(t.lastChecked)) {
                try {
                    const cookieStore = await cookies();
                    const sessionCookie = cookieStore.get('SESSION')?.value;

                    if (sessionCookie) {
                        // Ping backend to check session status and get updated expiry
                        const res = await fetch(`${process.env.API_URL}/auth/session-status`, {
                            method: 'GET',
                            headers: {
                                'Cookie': `SESSION=${sessionCookie}`,
                            },
                        });

                        if (res.ok) {
                            const newCookie = res.headers.get('set-cookie') ?? res.headers.get('Set-Cookie');
                            const newExpiry = parseSetCookieExpiry(newCookie ?? undefined);
                            if (newExpiry) {
                                t.sessionExpiresAt = newExpiry.toISOString();
                                t.lastChecked = Date.now();
                                console.log('✅ Updated session expiry:', t.sessionExpiresAt);
                            }
                        }
                    }
                } catch (err) {
                    console.error('Failed to check backend session:', err);
                }
            }

            // Refresh if close to expiring
            if (t.sessionExpiresAt) {
                const expiryTime = new Date(t.sessionExpiresAt).getTime();
                const now = Date.now();
                const timeLeft = expiryTime - now;

                // Refresh 2 minutes before expiry
                if (timeLeft < 2 * 60 * 1000 && timeLeft > 0) {
                    try {
                        const cookieStore = await cookies();
                        const sessionCookie = cookieStore.get('SESSION')?.value;

                        const res = await fetch(`${process.env.API_URL}/auth/refresh-session`, {
                            method: 'GET',
                            headers: {
                                'Cookie': `SESSION=${sessionCookie}`,
                            },
                        });

                        if (res.ok) {
                            const newCookie = res.headers.get('set-cookie') ?? res.headers.get('Set-Cookie');
                            const newExpiry = parseSetCookieExpiry(newCookie ?? undefined);
                            if (newExpiry) {
                                t.sessionExpiresAt = newExpiry.toISOString();
                                t.lastChecked = Date.now();
                            }
                        }
                    } catch (err) {
                        console.error('Failed to refresh backend session:', err);
                    }
                }
            }

            return t;
        },

        async session({ session, token }) {
            const t = token as MyToken;

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

// Helper function: Check backend every 60 seconds max
function shouldCheckBackend(lastChecked?: number): boolean {
    if (!lastChecked) return true;
    const timeSinceCheck = Date.now() - lastChecked;
    return timeSinceCheck > 60 * 1000; // Check every 60 seconds
}

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

export async function getSession() {
    return await getServerSession(authOptions);
}