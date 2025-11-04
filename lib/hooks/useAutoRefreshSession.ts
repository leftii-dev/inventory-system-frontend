// /lib/hooks/useAutoRefreshSession.ts
import {useEffect} from 'react';
import { useSession } from 'next-auth/react';

export function useAutoRefreshSession() {
    const { data: session, update } = useSession();

    useEffect(() => {
        if (!session?.sessionExpiresAt) return;

        const expiry = new Date(session.sessionExpiresAt).getTime();
        const now = Date.now();
        const timeUntilRefresh = expiry - now - 2 * 60 * 1000;

        if (timeUntilRefresh <= 0) {
            update();
            return;
        }

        const timer = setTimeout(() => update(), timeUntilRefresh);
        return () => clearTimeout(timer);
    }, [session?.sessionExpiresAt, update]);
}