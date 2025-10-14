// components/AuthButton.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
    const { data: session, status } = useSession();

    const handleSignOut = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error("Failed to sign out from backend:", error);
        }

        await signOut({ callbackUrl: '/login' });
    };

    if (status === "loading") {
        return <button disabled style={{ opacity: 0.5 }}>Loading...</button>;
    }

    if (session) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Welcome, {session.user?.name || session.user?.email}</span>
                {/* The button now calls our custom handler */}
                <button onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <Link href="/login">
            <button>Sign In</button>
        </Link>
    );
}