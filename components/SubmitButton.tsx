'use client'

import { useFormStatus } from "react-dom";
import { ReactNode } from 'react';

export default function SubmitButton({
    children,
    className
}: {
    children: ReactNode
    className?: string
}) {
    const { pending } = useFormStatus()
    return (
        <button
            type='submit'
            disabled={pending}
            className={className ?? `bg-brand-primary rounded-md px-2 text-white
                         md:transition-all md:duration-400 md:ease-in-out md:py-1 md:shadow md:hover:opacity-80
                         md:hover:cursor-pointer`}
        >
            {pending ? 'Submitting...' : children}
        </button>
    )
}