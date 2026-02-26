'use client';

import React, { InputHTMLAttributes } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string,
    label: string,
    error?:string
};

export default function FormInput({
    name,
    label,
    error,
    className,
    ...rest
}: FormInputProps) {
    return(
        <div>
            <label htmlFor={name} className={`block mb-1 font-medium font-inter`}>
                {label}
            </label>
            <input
                id={name}
                name={name}
                {...rest}
                className={className ?? `w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                        error ? 'border-red-500' : 'border-gray-300'}
                    `}
            />
            {error && (
                <p className={`text-red-600 text-sm mt-1`}>{error}</p>
            )}
        </div>
    )
}