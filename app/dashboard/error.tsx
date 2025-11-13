'use client';

import Link from 'next/link';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
    console.error(error);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-red-600">Something went wrong!</h1>
            <p>{error.message}</p>
            <div className="mt-4 flex gap-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:cursor-pointer"
                    onClick={() => reset()}
                >
                    Try again
                </button>
                <Link href="/dashboard">Go back to dashboard</Link>
            </div>
        </div>
    );
}