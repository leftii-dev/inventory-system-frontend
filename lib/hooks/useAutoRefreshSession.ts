// /lib/hooks/useAutoRefreshSession.ts
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export function useAutoRefreshSession() {
    const { data: session, update, status } = useSession();
    const sessionExpiresAt = session?.sessionExpiresAt;

    // Track if we've already scheduled a refresh for this expiry time
    const scheduledExpiryRef = useRef<string | null>(null);

    useEffect(() => {
        console.log('[useAutoRefreshSession] status:', status, 'sessionExpiresAt:', sessionExpiresAt);

        if (status !== 'authenticated') return;
        if (!sessionExpiresAt) return;

        console.log(sessionExpiresAt)
        console.log(Date.now())
        console.log(new Date(sessionExpiresAt).getTime() < Date.now() ? 'expired' : 'valid')

        // Prevent re-scheduling for the same expiry time
        if (scheduledExpiryRef.current === sessionExpiresAt) {
            return;
        }

        scheduledExpiryRef.current = sessionExpiresAt;

        const expiry = new Date(sessionExpiresAt).getTime();
        const now = Date.now();
        const timeUntilRefresh = expiry - now - 2 * 60 * 1000; // 2 min before expiry

        if (timeUntilRefresh <= 0) {
            console.log('[useAutoRefreshSession] Session expired, refreshing immediately');
            update();
            return;
        }

        console.log('[useAutoRefreshSession] Scheduling refresh in', Math.round(timeUntilRefresh / 1000), 'seconds');
        const timer = setTimeout(() => {
            console.log('[useAutoRefreshSession] Timer fired, updating session');
            update();
        }, timeUntilRefresh);

        return () => {
            console.log('[useAutoRefreshSession] Cleaning up timer');
            clearTimeout(timer);
        };
    }, [status, sessionExpiresAt, update]);
}