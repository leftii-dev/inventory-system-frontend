// /lib/hooks/useAutoRefreshSession.ts
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export function useAutoRefreshSession() {
    const { data: session, update, status } = useSession();
    const sessionExpiresAt = session?.sessionExpiresAt;
    const scheduledExpiryRef = useRef<string | null>(null);

    useEffect(() => {
        console.log('[useAutoRefreshSession] status:', status, 'sessionExpiresAt:', sessionExpiresAt);

        if (status !== 'authenticated') return;
        if (!sessionExpiresAt) return;

        if (scheduledExpiryRef.current === sessionExpiresAt) {
            return;
        }

        scheduledExpiryRef.current = sessionExpiresAt;

        const expiry = new Date(sessionExpiresAt).getTime();
        const now = Date.now();
        const timeUntilRefresh = expiry - now - 2 * 60 * 1000;

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