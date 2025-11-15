// hooks/useSession.ts
'use client';

import useSWR from 'swr';
import {UserResponse} from "@/lib/users/users.types";

const fetcher = (url: string) => fetch(url, {credentials: "include"}).then(r => r.json());

interface SessionData {
    user: UserResponse | null;
}

export function useSession() {
    const { data, error, mutate, isLoading } = useSWR<SessionData>('/api/session', fetcher, {
        refreshInterval: 60000, // Refresh every 60 seconds
        revalidateOnFocus: true, // Check when user returns to tab
        revalidateOnReconnect: true, // Check when reconnecting
        dedupingInterval: 2000, // Prevent duplicate requests within 2s
    });

    console.log("useSession data:", data);

    return {
        user: data?.user ?? null,
        isLoading: isLoading || data === undefined,
        isError: !!error,
        mutate, // Call this to manually refresh the session
    };
}