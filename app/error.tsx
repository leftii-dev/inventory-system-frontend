'use client';

import Link from 'next/link';

export default function RootError({
                                      error,
                                      reset,
                                  }: {
    error: Error;
    reset: () => void;
}) {
    console.error('Unhandled error:', error);

    return (
        <div className="min-h-screen flex flex-col items-center  p-8">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong!</h1>
            <p className="mb-4">{error.message}</p>

            <div className="flex gap-4">
                {/* Retry current route */}
                <button
                    onClick={() => reset()}
                    className="hover:cursor-pointer px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Try Again
                </button>

                {/* Go home */}
                <Link href="/" className="px-4 py-2 bg-gray-200 rounded">
                    Go Home
                </Link>
            </div>
        </div>
    );
}
