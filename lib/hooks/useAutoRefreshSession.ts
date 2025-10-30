// /lib/hooks/useAutoRefreshSession.ts
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {clearTimeout} from "node:timers";

export function useAutoRfreshSession() {
    const { data: session, update } = useSession();

    useEffect(() => {
        if(!session?.sessionExpiresAt) return;
        const expiry = new Date(session.sessionExpiresAt).getTime();
        const now = Date.now();
        const timeUntilRefresh = expiry - now - 2 * 60 * 1000 // Refresh 2 minutes before expiration

        // Handle expired or close-to expiring
        if (timeUntilRefresh <= 0) {
            update(); // Trigger session refresh
            return;
        }

        // Timer for expiration
        const timer = setTimeout(() => {
            update();
        }, timeUntilRefresh);

        return () => clearTimeout(timer);
    }, [session?.sessionExpiresAt, update]);
}