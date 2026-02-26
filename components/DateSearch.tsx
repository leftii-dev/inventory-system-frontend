'use client';

import {useEffect, useRef, useState} from "react";

export default function DateSearch<T extends Record<string, string | undefined>, K extends keyof T>({
        param,
        filters,
        setFilters
    }:{
    param: K,
    filters: T,
    setFilters: React.Dispatch<React.SetStateAction<T>>,
}) {

    const [date, setDate] = useState<string>(filters[param] ?? '');
    const lastFiltersValue = useRef<string | undefined>(filters[param]);

    useEffect(() => {
        if (filters[param] !== lastFiltersValue.current) {
            setDate(filters[param] ?? '');
            lastFiltersValue.current = filters[param];
        }
    }, [filters, param]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (date === '' || !isNaN(Date.parse(date))) {
                setFilters((prev) => ({ ...prev, [param]: date }));
                lastFiltersValue.current = date;
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [param, setFilters, date]);

    return (
        <input
            type="date"
            className={`w-full p-1 text-xs text-center`}
            placeholder={`Search...`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
        />
    )
}