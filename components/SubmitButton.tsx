'use client'

import { useFormStatus } from "react-dom";
import { ReactNode } from 'react';

export default function SubmitButton({
    children,
    className,
    disabled
}: {
    children: ReactNode
    className?: string
    disabled?: boolean
}) {
    const { pending } = useFormStatus()
    return (
        <button
            type='submit'
            disabled={pending || disabled}
            className={className ?? `bg-brand-primary rounded-md px-2 text-white
             md:transition-all md:duration-400 md:ease-in-out md:py-1 md:shadow 
             hover:not-disabled:opacity-80
             disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400`}
        >
            {pending ? 'Submitting...' : children}
        </button>
    )
}