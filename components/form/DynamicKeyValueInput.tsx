'use client'

import { useState, useEffect, useRef } from 'react';
import { X, Plus, ChevronDown, ChevronRight } from 'lucide-react';

type KeyValuePair = {
    id: string;
    key: string;
    value: string;
};

type DynamicKeyValueInputProps = {
    label: string;
    name: string;
    defaultValue?: Record<string, unknown>;
    error?: string;
    defaultExpanded?: boolean;
};

export default function DynamicKeyValueInput({
                                                 label,
                                                 name,
                                                 defaultValue = {},
                                                 error,
                                                 defaultExpanded = false
                                             }: DynamicKeyValueInputProps) {
    const [pairs, setPairs] = useState<KeyValuePair[]>([]);
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const isInitialized = useRef(false);

    // Initialize from defaultValue
    useEffect(() => {
        if (defaultValue && Object.keys(defaultValue).length > 0) {
            const initialPairs = Object.entries(defaultValue).map(([key, value]) => ({
                id: Math.random().toString(36).substr(2, 9),
                key,
                value: String(value)
            }));
            setPairs(initialPairs);
        }
        setTimeout(() => {
            isInitialized.current = true;
        }, 0);
    }, []);

    useEffect(() => {
        if (!isInitialized.current) {
            return;
        }

        if (hiddenInputRef.current) {
            requestAnimationFrame(() => {
                if (hiddenInputRef.current) {
                    const changeEvent = new Event('change', { bubbles: true });
                    const inputEvent = new Event('input', { bubbles: true });
                    hiddenInputRef.current.dispatchEvent(changeEvent);
                    hiddenInputRef.current.dispatchEvent(inputEvent);
                }
            });
        }
    }, [pairs]);

    const addPair = () => {
        setPairs([
            ...pairs,
            {
                id: Math.random().toString(36).substr(2, 9),
                key: '',
                value: ''
            }
        ]);
    };

    const removePair = (id: string) => {
        setPairs(pairs.filter(pair => pair.id !== id));
    };

    const updatePair = (id: string, field: 'key' | 'value', newValue: string) => {
        setPairs(
            pairs.map(pair =>
                pair.id === id ? { ...pair, [field]: newValue } : pair
            )
        );
    };

    // Convert pairs to JSON for form submission
    const jsonValue = JSON.stringify(
        pairs.reduce((acc, pair) => {
            if (pair.key) {
                acc[pair.key] = pair.value;
            }
            return acc;
        }, {} as Record<string, string>)
    );

    return (
        <div className="flex flex-col gap-2 border border-gray-200 rounded-lg p-4">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-left"
            >
        <span className="font-medium font-inter flex items-center gap-2">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            {label}
            {pairs.length > 0 && (
                <span className="text-sm text-gray-500">({pairs.length} items)</span>
            )}
        </span>
            </button>

            {/* Hidden input to submit the JSON data */}
            <input
                ref={hiddenInputRef}
                type="hidden"
                name={name}
                value={jsonValue}
            />

            {isExpanded && (
                <>
                    <div className="flex flex-col gap-2 mt-2">
                        {pairs.map((pair) => (
                            <div key={pair.id} className="flex gap-2 items-start">
                                <input
                                    type="text"
                                    placeholder="Key"
                                    value={pair.key}
                                    onChange={(e) => updatePair(pair.id, 'key', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={pair.value}
                                    onChange={(e) => updatePair(pair.id, 'value', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removePair(pair.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addPair}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors w-fit"
                    >
                        <Plus size={16} />
                        Add {label}
                    </button>
                </>
            )}

            {error && (
                <span className="text-sm text-red-600">{error}</span>
            )}
        </div>
    );
}