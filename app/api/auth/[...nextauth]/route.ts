import NextAuth, {AuthOptions, getServerSession, User} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {parseSetCookieExpiry} from "@/lib/auth/cookie";
import {JWT} from "next-auth/jwt";

interface MyToken extends JWT {
    backendCookie?: string;
    sessionExpiresAt?: string;
    invalidated?: boolean;
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Email or Employee ID', type: 'text' },
                isOAuthCallback: { type: 'hidden' },
                userJSON: { type: 'hidden' },
            },
            async authorize(credentials, req) {
                // Handle OAuth callback - user data already fetched server-side
                if (credentials?.isOAuthCallback === 'true' && credentials?.userJSON) {
                    try {
                        const user = JSON.parse(credentials.userJSON);
                        if (user && user.id) {
                            // User object already has backendCookie and sessionExpiresAt
                            return user;
                        }
                    } catch (error) {
                        console.error("Failed to parse userJSON during OAuth callback", error);
                        return null;
                    }
                    return null;
                }

                // Handle traditional credentials login
                if (credentials?.identifier) {
                    const meUrl = `${process.env.API_URL}/users/me`

                    try {
                        const res = await fetch(meUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Cookie': req.headers?.cookie || ''
                            },
                            credentials: "include"

                        });

                        if (!res.ok) {
                            console.log("Backend /auth/me failed:", res.status, await res.text());
                            return null;
                        }

                        const apiResponse = await res.json();
                        const user = apiResponse.data;

                        const setCookie = res.headers.get('set-cookie') ?? res.headers.get('Set-Cookie');
                        const sessionExpiresAt = parseSetCookieExpiry(setCookie ?? undefined);

                        if (user) {
                            user.backendCookie = setCookie?.split(';')[0];
                            user.sessionExpiresAt = sessionExpiresAt?.toISOString();
                            return user;
                        }

                        return null;
                    } catch (error) {
                        console.error("Credentials login error:", error);
                        return null;
                    }
                }
                return null;
            },
        }),
    ],

    session: {
        strategy: 'jwt',
    },

    callbacks: {
        async jwt({ token, user }): Promise<MyToken> {
            const t = token as MyToken;

            if (user) {
                const backendUser = user as User & {
                    backendCookie?: string;
                    sessionExpiresAt?: string;
                };
                token.backendCookie = backendUser.backendCookie;
                token.sessionExpiresAt = backendUser.sessionExpiresAt;
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }

            // Check if backend session has expired
            if (token.sessionExpiresAt && new Date(token.sessionExpiresAt) < new Date()) {
                console.log('Backend session expired - invalidating token');
                return {
                    ...t,
                    id: '',
                    name: '',
                    email: '',
                    backendCookie: undefined,
                    sessionExpiresAt: undefined,
                    invalidated: true,
                };
            }

            return token;
        },

        async session({ session, token }) {
            const t = token as MyToken;

            if (!t || t.invalidated) {
                session.user = { id: '', name: '', email: '' };
                session.backendCookie = undefined;
                session.sessionExpiresAt = undefined;
                return session;
            }

            if (token && session.user) {
                session.backendCookie = token.backendCookie;
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.sessionExpiresAt = token.sessionExpiresAt;
            }

            return session;
        },
    },

    pages: {
        signIn: '/auth/login',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export async function getSession() {
    return await getServerSession(authOptions);
}