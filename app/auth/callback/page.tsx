"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function AuthCallbackPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/users/me`, {
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Backend returned status ${res.status}.`);
                }
                return res.json();
            })
            .then(apiResponse => {
                const user = apiResponse.data;
                if (!user) {
                    throw new Error("User data not found in backend response.");
                }

                signIn("credentials", {
                    isOAuthCallback: true,
                    userJSON: JSON.stringify(user),
                    redirect: false,
                }).then((result) => {
                    if (result?.ok) {
                        router.push("/dashboard");
                    } else {
                        setError("Could not create a NextAuth session.");
                    }
                });
            })
            .catch(err => {
                console.error("Auth callback failed:", err);
                setError(err.message || "An unexpected error occurred.");
            });

    }, [router]);

    if (error) {
        return (
            <div>
                <h2>Authentication Failed</h2>
                <p>{error}</p>
                <a href="/login">Return to Login</a>
            </div>
        );
    }

    return <div>Finalizing your login... Please wait.</div>;
}

