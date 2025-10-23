'use client'

import React, {useState, FormEvent} from 'react';

type FormCardProps<S> = {
    action: (formData: FormData) => Promise<S>;
    initialState: S;
    childrenAction: (state: S, isPending: boolean) => React.ReactNode;
    confirmMessage?: string;
};

export default function FormCard<S>({
    action,
    initialState,
    childrenAction,
    confirmMessage
}: FormCardProps<S>) {
    const [state, setState] = useState<S>(initialState);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(confirmMessage && !window.confirm(confirmMessage)) {
            return;
        }

        setIsPending(true);
        const formData = new FormData(e.currentTarget);

        try {
            const result = await action(formData);
            setState(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`w-full max-w-lg bg-white p-8 rounded-lg shadow-md border border-gray-300`}
            >
            {childrenAction(state, isPending)}
        </form>
    );
}