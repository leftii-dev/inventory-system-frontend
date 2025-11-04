"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthButton() {
    const { data: session, status } = useSession({ required: false });
    const [hydrated, setHydrated] = useState(false);

    // Ensure we only render after hydration to prevent null flashes
    useEffect(() => {
        setHydrated(true);
    }, []);

    const handleSignOut = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to sign out from backend:", error);
        }

        await signOut({ callbackUrl: "/auth/login" });
    };

    // Show nothing until client hydration completes
    if (!hydrated || status === "loading") {
        return (
            <div className="flex justify-end items-end gap-3 md:mb-4">
                <div className="md:h-12 md:w-52 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
        );
    }

    if (session) {
        return (
            <div className="flex flex-col w-full md:flex-row md:justify-end md:items-end md:gap-3 md:whitespace-nowrap md:mb-4">
                <button
                    className="font-inter px-2 py-2 bg-blue-400 rounded md:rounded-md md:py-1 text-white md:whitespace-nowrap md:hover:bg-blue-300 hover:cursor-pointer"
                    onClick={handleSignOut}
                >
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full items-center gap-y-2 md:flex-row md:justify-end md:items-end md:gap-3 md:mb-4">
            <Link href="/auth/login" className="w-full">
                <button className="font-inter px-2 py-2 w-full text-white bg-brand-primary rounded-md md:border-2 md:bg-white md:border-brand-primary md:rounded-xl md:py-1 md:text-black md:hover:border-white md:hover:text-white md:hover:bg-brand-primary md:hover:cursor-pointer">
                    Login
                </button>
            </Link>
            <Link href="/auth/register" className="w-full">
                <button className="font-inter w-full px-2 py-2 md:border-2 md:border-black md:bg-black md:text-white md:whitespace-nowrap md:rounded-xl md:py-1 md:hover:opacity-75 md:hover:cursor-pointer">
                    Sign Up
                </button>
            </Link>
        </div>
    );
}
