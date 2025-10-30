// /app/auth/login/LoginForm.tsx
'use client';

import FormCard from "@/components/form/FormCard";
import {ActionResult} from "@/lib/utils/api.actions";
import {LoginUserSchema} from "@/lib/auth/auth.schemas";
import {z} from "zod";
import {loginAction} from "@/lib/auth/auth.actions";
import SubmitButton from "@/components/SubmitButton";
import FormInput from "@/components/form/FormInput";
import {useRouter} from "next/navigation";
import {signIn, useSession} from "next-auth/react";
import {useEffect, useRef} from "react";

export default function LoginForm({
    initialData,
    callbackUrl
}:{
    initialData: z.infer<typeof LoginUserSchema>,
    callbackUrl: string
}) {
    const router = useRouter();
    const hasRedirected = useRef(false);

    return (
        <FormCard<ActionResult<typeof LoginUserSchema>>
            action={loginAction}
            initialState={{
                success: true,
                data: initialData,
            }}
        >
            {(state) => {
                if(!state.success) {
                    state.errors = {...state.errors, general: 'Invalid email or password'}
                }

                const ClientEffects = () => {
                    const router = useRouter();
                    const { data: session, status } = useSession();

                    useEffect(() => {
                        if (
                            state.success &&
                            'data' in state &&
                            !hasRedirected.current &&
                            state.data?.email
                        ) {
                            signIn("credentials", { redirect: false, identifier: state.data.email })
                                .then((res) => {
                                    if(res?.ok) {
                                        router.push(callbackUrl);
                                    }
                                });
                        }
                    }, [state.success, router, callbackUrl]);

                    return null; // no UI
                };

                    return(
                        <div>
                            <ClientEffects />
                            <FormInput
                                key={`email-${state.success}`}
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