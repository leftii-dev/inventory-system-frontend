// lib/auth/session.ts
import { cookies } from 'next/headers';
import {UserResponse} from "@/lib/users/users.types";

export async function getSession():Promise<UserResponse | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('SESSION')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const res = await fetch(`${process.env.API_URL}/auth/session-status`, {
            headers: {
                'Cookie': `SESSION=${sessionCookie}`,
            },
            cache: 'no-store',
        });

        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.error('Session check failed:', error);
    }

    return null;
}