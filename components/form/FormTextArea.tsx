'use client';

import React, { TextareaHTMLAttributes } from "react";

type FormTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    name: string,
    label: string,
    error?: string
};

export default function FormTextArea(
    {
        name,
        label,
        error,
        ...rest
    }: FormTextAreaProps)
{
    return (
        <div>
            <label htmlFor={name} className={`block mb-1 font-medium font-inter`}>
                {label}
            </label>
            <textarea
                id={name}
                name={name}
                {...rest}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                    error ? 'border-red-500' : 'border-gray-300'}
                `}
            />
            {error && (
                <p className={`text-red-600 text-sm mt-1`}>{error}</p>
            )}
        </div>
    )
}