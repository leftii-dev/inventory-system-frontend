'use client'

import {useActionState, ReactNode, useState, useEffect, useRef} from 'react';
import { useRouter } from 'next/navigation';
import { ActionResult } from '@/lib/utils/api.actions';

type WithUnauthorized<T> = ActionResult<T> & { unauthorized?: boolean };

type FormCardProps<T> = {
    action: (prevState: ActionResult<T>, formData: FormData) => Promise<WithUnauthorized<T>>;
    initialState: ActionResult<T>;
    children: (state: ActionResult<T>) => ReactNode;
    confirmMessage?: string;
    onSuccess?: (payload: T) => void;
};

export default function FormCard<T>({
                                        action,
                                        initialState,
                                        children,
                                        confirmMessage,
                                        onSuccess,
                                    }: FormCardProps<T>) {
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const router = useRouter();
    const onSuccessRef = useRef(onSuccess);

    useEffect(() => {
        onSuccessRef.current = onSuccess;
    }, [onSuccess]);

    const wrappedAction = async (
        prevState: ActionResult<T>,
        formData: FormData
    ): Promise<ActionResult<T>> => {
        setHasSubmitted(true);
        const result = await action(prevState, formData);

        if (result.unauthorized) {
            router.push('/auth/login?reason=session-expired');
            return prevState;
        }

        if (result.ok && result.response?.success) {
            // Trigger success immediately
            onSuccessRef.current?.(result.response.data);
        }

        return result;
    };

    const [state, formAction, isPending] = useActionState<ActionResult<T>, FormData>(
        wrappedAction,
        initialState
    );

    const handleSubmit = (formData: FormData) => {
        if (confirmMessage && typeof window !== 'undefined' && !window.confirm(confirmMessage)) {
            return;
        }
        formAction(formData);
    };

    return (
        <form
            action={handleSubmit}
            className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md border border-gray-300"
        >
            {hasSubmitted && 'ok' in state && (
                <div
                    className={`p-3 my-3 rounded text-center ${
                        state.ok
                            ? 'bg-green-100 text-green-800 border border-green-400'
                            : 'bg-red-100 text-red-800 border border-red-400'
                    }`}
                >
                    {state.ok ? 'Success!' : state.errors?.general ?? 'Something went wrong.'}
                </div>
            )}

            <fieldset disabled={isPending} className={isPending ? 'opacity-55' : ''}>
                {children(state)}
            </fieldset>
        </form>
    );
}
