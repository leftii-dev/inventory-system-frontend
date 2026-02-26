'use client';

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type NumberSearchProps<T> = {
    param: "cost" | "price" | "totalCost" | "totalPrice";
    setFilters: React.Dispatch<React.SetStateAction<T>>;
    min?: number;
    max?: number;
    maxIntegerDigits?: number;
    maxFractionDigits?: number;
    debounceMs?: number;
};

export default function AboveBelowEqualsSearch<T extends Record<string, string | undefined>>({
                                                   param,
                                                   setFilters,
                                                   min = 0.01,
                                                   max = 9999999999.99,
                                                   maxIntegerDigits = 10,
                                                   maxFractionDigits = 2,
                                                   debounceMs = 300,
                                               }: NumberSearchProps<T>) {
    const [operator, setOperator] = useState<"Above" | "Below" | "Equal">("Equal");
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            const num = parseFloat(value);

            if (value.trim() === "") {
                setError(null);
                setFilters((prev) => {
                    const next = { ...prev };
                    delete next[`${param}Above`];
                    delete next[`${param}Below`];
                    delete next[`${param}Equal`];
                    return next;
                });
                return;
            }

            if (isNaN(num)) {
                setError("Value must be a valid number");
                return;
            }

            if (num < min) {
                setError(`Value cannot be less than $${min}`);
                return;
            }

            if (num > max) {
                setError(`Value cannot exceed $${max}`);
                return;
            }

            const [intPart, fracPart] = value.split(".");
            if (intPart.length > maxIntegerDigits || (fracPart && fracPart.length > maxFractionDigits)) {
                setError(`Maximum ${maxIntegerDigits} digits before and ${maxFractionDigits} digits after the decimal`);
                return;
            }

            setError(null);
            setFilters((prev) => {
                const next = { ...prev };
                delete next[`${param}Above`];
                delete next[`${param}Below`];
                delete next[`${param}Equal`];

                next[`${param}${operator}` as keyof T] = value as T[keyof T];
                return next;
            });
        }, debounceMs);

        return () => clearTimeout(handler);
    }, [value, operator, param, setFilters, min, max, maxIntegerDigits, maxFractionDigits, debounceMs]);

    return (
        <div className="flex flex-col gap-1 items-center w-full">
            <div className="flex items-stretch w-full">
                <div className="relative flex-1">
                    <select
                        value={operator}
                        onChange={(e) => setOperator(e.target.value as "Above" | "Below" | "Equal")}
                        className="appearance-none w-full px-2 py-1 pr-5 text-xs cursor-pointer text-right"
                    >
                        <option value="Above">Above</option>
                        <option value="Below">Below</option>
                        <option value="Equal">Equal</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                </div>

                <input
                    type="number"
                    step="0.01"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="$"
                    className={`px-2 py-1 text-sm w-32 ${error ? "border-red-500" : ""}`}
                />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>

    );
}
