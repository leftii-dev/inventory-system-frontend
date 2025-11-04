'use client'

import {useActionState, ReactNode, useState } from 'react';
import {useRouter} from 'next/navigation';


type WithUnauthorized<T> = T & { unauthorized?: boolean };

type FormCardProps<Output> = {
    action: (prevState: Output, formData: FormData) => Promise<WithUnauthorized<Output>>;
    initialState: Output;
    children: (state: Output) => ReactNode;
    confirmMessage?: string;
};

export default function FormCard<Output extends { success?: boolean; errors?: Record<string, string> }>({
    action,
    initialState,
    children,
    confirmMessage
}: FormCardProps<Output>) {
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const router = useRouter();

    const wrappedAction = async (prevState: Awaited<Output>, formData: FormData): Promise<Output> => {
        setHasSubmitted(true);
        const result = await action(prevState as Output, formData)

        if (result.unauthorized) {
            router.push('/auth/login?reason=session-expired')
            return prevState as Output
        }

        return result as Output
    }

    const [state, formAction, isPending] = useActionState<Output, FormData>(
        wrappedAction,
        initialState as Awaited<Output>
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
            {hasSubmitted && 'ok' in state && (
                <div
                    className={`p-3 my-3 rounded text-center ${
                        state.ok
                            ? 'bg-green-100 text-green-800 border border-green-400'
                            : 'bg-red-100 text-red-800 border border-red-400'
                    }`}
                >
                    {state.ok
                        ? 'Success!'
                        : state.errors?.general ?? 'Something went wrong.'}
                </div>
            )}

            <fieldset disabled={isPending} className={isPending ? 'opacity-55' : ''}>
            {children(state)}
            </fieldset>
        </form>
    );
}