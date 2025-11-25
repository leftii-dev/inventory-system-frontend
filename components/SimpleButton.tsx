import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
}
export default function SimpleButton({
    children,
    className = '',
    variant = 'primary',
    isLoading = false,
    disabled,
    ...rest
 }: ButtonProps) {
    const baseStyles= `inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors
        hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`

    const variants = {
        primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 focus:ring-brand-primary/70',
        secondary: 'bg-brand-secondary text-white hover:bg-gray-700 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',

    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || disabled}
            {...rest}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    )
}