'use client';

import { ProductFilters } from "@/lib/products/product.types";
import React, { JSX, useEffect, useState, useRef } from "react";

export default function StringSearch<K extends keyof ProductFilters>({
                                                                         param,
                                                                         filters,
                                                                         setFilters,
                                                                         minLength,
                                                                         maxLength
                                                                     }: {
    param: K,
    filters: ProductFilters,
    setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>,
    minLength: number,
    maxLength: number
}): JSX.Element {
    const [text, setText] = useState<string>(filters[param] ?? '');
    const lastFiltersValue = useRef(filters[param]);

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
