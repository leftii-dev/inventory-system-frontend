// /app/auth/login/LoginForm.tsx
'use client';

import FormCard from "@/components/form/FormCard";
import {ActionResult} from "@/lib/utils/api.actions";
import {loginAction} from "@/lib/auth/auth.actions";
import SubmitButton from "@/components/SubmitButton";
import FormInput from "@/components/form/FormInput";
import {useRouter} from "next/navigation";
import {signIn, useSession} from "next-auth/react";
import {useEffect, useRef} from "react";
import {UserResponseSession} from '@/lib/auth/auth.actions'
import {ApiResponseDto} from "@/lib/types/validation.types";

export default function LoginForm({
    initialData,
    callbackUrl
}:{
    initialData: ApiResponseDto<UserResponseSession>,
    callbackUrl: string
}) {
    const hasRedirected = useRef(false);

    return (
        <FormCard<ActionResult<UserResponseSession>>
            action={loginAction}
            initialState={{
                ok: true,
                response: initialData,
                errors:{}
            }}
        >
            {(state) => {
                if(!state.ok) {
                    state.errors = {...state.errors, general: 'Invalid email or password'}
                }

                const ClientEffects = () => {
                    const router = useRouter();
                    useSession();

                    useEffect(() => {
                        if (
                            state.ok &&
                            !hasRedirected.current &&
                            state.response?.data.email
                        ) {
                            signIn("credentials", {
                                redirect: false,
                                userJSON: JSON.stringify({
                                    id: state.response?.data.id,
                                    name: state.response?.data.name,
                                    email: state.response?.data.email,
                                    backendCookie: state.response?.data.backendCookie,
                                    sessionExpiresAt: state.response?.data.sessionExpiresAt
                                    })
                            })
                                .then((res) => {
                                    if(res?.ok) {
                                        router.push(callbackUrl);
                                    }
                                });
                        }
                    }, [router]);

                    return null; // no UI
                };

                    return(
                        <div>
                            <ClientEffects />
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
                    )
            }}
        </FormCard>
    );
}