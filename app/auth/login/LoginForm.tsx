// app/auth/login/LoginForm.tsx
'use client';

import FormCard from "@/components/form/FormCard";
import { loginAction } from "@/lib/auth/auth.actions";
import SubmitButton from "@/components/SubmitButton";
import FormInput from "@/components/form/FormInput";
import { useRouter } from "next/navigation";
import { useRef } from "react";
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

    const handleSuccess = () => {
        if (hasRedirected.current) return;
        hasRedirected.current = true;

        mutate().then(() => {
            router.push(callbackUrl);
        }).catch(() => {
            router.push(callbackUrl);
        });
    };

    return (
        <FormCard<UserResponse>
            action={loginAction}
            initialState={{
                ok: false,
                response: initialData,
                errors: {}
            }}
            onSuccess={handleSuccess}
        >
            {(state) => (
                <div className={'flex flex-col gap-2'}>
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
            )}
        </FormCard>
    );
}
