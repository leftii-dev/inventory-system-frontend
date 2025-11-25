// app/auth/login/LoginForm.tsx
'use client';

import FormCard from "@/components/form/FormCard";
import { loginAction } from "@/lib/auth/auth.actions";
import SubmitButton from "@/components/SubmitButton";
import FormInput from "@/components/form/FormInput";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { UserResponse } from '@/lib/users/users.types';
import { ApiResponseDto } from "@/lib/types/validation.types";
import { useSession } from "@/lib/hooks/useSession";

export default function LoginForm({
                                      initialData,
                                      callbackUrl
                                  }: {
    initialData: ApiResponseDto<UserResponse>,
    callbackUrl: string
}) {
    const hasRedirected = useRef(false);
    const router = useRouter();
    const { mutate } = useSession();

    return (
        <FormCard<UserResponse>
            action={loginAction}
            initialState={{
                ok: true,
                response: initialData,
                errors: {}
            }}
        >
            {(state) => {
                if (!state.ok) {
                    state.errors = { ...state.errors, general: 'Invalid email or password' };
                }


                const LoginEffects = () => {
                    useEffect(() => {
                        if (state.ok && state.response?.data?.email && !hasRedirected.current) {
                            hasRedirected.current = true;

                            // Refresh the session cache, then redirect
                            mutate().then(() => {
                                router.push(callbackUrl);
                            }).catch((err) => {
                                console.error("Failed to refresh session:", err);
                                // Still redirect even if refresh fails
                                router.push(callbackUrl);
                            });
                        }
                    }, [state.ok, state.response?.data?.email]);

                    return null; // This component only handles effects
                };

                return (
                    <div>
                        <LoginEffects />
                        <FormInput
                            key={`email-${state.ok}`}
                            label={'Email:'}
                            name={'email'}
                            type={'text'}
                            required={true}
                        />
                        <FormInput
                            label={'Password:'}
                            name={'password'}
                            type={'password'}
                            required={true}
                        />

                        <SubmitButton>
                            Login
                        </SubmitButton>
                    </div>
                );
            }}
        </FormCard>
    );
}