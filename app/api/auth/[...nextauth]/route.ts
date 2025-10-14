import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Email or Employee ID', type: 'text' },
                password: { label: 'Password', type: 'password' },
                isOAuthCallback: { type: 'hidden' },
                userJSON: { type: 'hidden' },
            },
            async authorize(credentials) {
                if (credentials?.isOAuthCallback && credentials?.userJSON) {
                    try {
                        const user = JSON.parse(credentials.userJSON);
                        if (user && user.id) {
                            return user;
                        }
                    } catch (error) {
                        console.error("Failed to parse userJSON during OAuth callback", error);
                        return null;
                    }
                    return null;
                }

                if (credentials?.identifier && credentials?.password) {
                    const { identifier, password } = credentials;

                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    let loginUrl = '';
                    const isEmail = emailRegex.test(identifier);

                    if (isEmail) {
                        loginUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/auth/user`;
                    } else {
                        loginUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/auth/employee`;
                    }

                    try {
                        const res = await fetch(loginUrl, {
                            method: 'POST',
                            body: JSON.stringify(
                                isEmail
                                    ? { email: identifier, password: password }
                                    : { employeeCode: identifier, password: password }
                            ),
                            headers: { 'Content-Type': 'application/json' },
                        });

                        if (!res.ok) {
                            return null;
                        }

                        const apiResponse = await res.json();
                        const user = apiResponse.data;

                        if (user) {
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
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },

    pages: {
        signIn: '/login',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

