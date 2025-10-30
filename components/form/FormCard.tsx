'use client'

import {useActionState, ReactNode, useState } from 'react';
import {useRouter} from 'next/navigation';


type WithUnauthorized<T> = T & { unauthorized?: boolean };

type FormCardProps<S> = {
    action: (prevState: S, formData: FormData) => Promise<WithUnauthorized<S>>;
    initialState: S;
    children: (state: S) => ReactNode;
    confirmMessage?: string;
};

export default function FormCard<S extends { success?: boolean; errors?: Record<string, string> }>({
    action,
    initialState,
    children,
    confirmMessage
}: FormCardProps<S>) {
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const router = useRouter();

    const wrappedAction = async (prevState: Awaited<S>, formData: FormData): Promise<S> => {
        setHasSubmitted(true);
        const result = await action(prevState as S, formData)

        if (result.unauthorized) {
            router.push('/auth/login?reason=session-expired')
            return prevState as S
        }

        return result as S
    }

    const [state, formAction, isPending] = useActionState<S, FormData>(
        wrappedAction,
        initialState as Awaited<S>
    )

    const handleSubmit = (formData: FormData) => {
        if (confirmMessage && typeof window !== 'undefined' && !window.confirm(confirmMessage)) {
            return
        }
        formAction(formData)
    }


    return (

        <form
            action={handleSubmit}
            className={`w-full max-w-lg bg-white p-8 rounded-lg shadow-md border border-gray-300`}
            >
            {hasSubmitted && 'success' in state && (
                <div
                    className={`p-3 my-3 rounded text-center ${
                        state.success
                            ? 'bg-green-100 text-green-800 border border-green-400'
                            : 'bg-red-100 text-red-800 border border-red-400'
                    }`}
                >
                    {state.success
                        ? 'Saved successfully!'
                        : state.errors?.general ?? 'Something went wrong.'}
                </div>
            )}

            <fieldset disabled={isPending} className={isPending ? 'opacity-55' : ''}>
            {children(state)}
            </fieldset>
        </form>
    );
}