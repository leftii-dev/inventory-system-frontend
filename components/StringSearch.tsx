'use client';

import React, { JSX, useEffect, useState, useRef } from "react";

export default function StringSearch<T extends Record<string, string | undefined>, K extends keyof T>({
                                                                         param,
                                                                         filters,
                                                                         setFilters,
                                                                         minLength,
                                                                         maxLength
                                                                     }: {
    param: K,
    filters: T,
    setFilters: React.Dispatch<React.SetStateAction<T>>,
    minLength: number,
    maxLength: number
}): JSX.Element {
    const [text, setText] = useState<string>(filters[param] ?? '');
    const lastFiltersValue = useRef<string | undefined>(filters[param]);

    // Sync with filters only if externally changed
    useEffect(() => {
        if (filters[param] !== lastFiltersValue.current) {
            setText(filters[param] ?? '');
            lastFiltersValue.current = filters[param];
        }
    }, [filters, param]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (text === '' || (text.length >= minLength && text.length <= maxLength)) {
                setFilters((prev) => ({ ...prev, [param]: text }));
                lastFiltersValue.current = text;
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [text, param, setFilters, minLength, maxLength]);

    return (
        <input
            className={`w-full p-1 text-xs text-center`}
            placeholder={`Search...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
        />
    );
}
