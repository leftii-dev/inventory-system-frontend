// /app/auth/login/LoginForm.tsx
'use client';

import FormCard from "@/components/form/FormCard";
import {ActionResult} from "@/lib/utils/api.actions";
import {LoginUserSchema} from "@/lib/auth/auth.schemas";
import {z} from "zod";
import {loginAction} from "@/lib/auth/auth.actions";
import SubmitButton from "@/components/SubmitButton";
import FormInput from "@/components/form/FormInput";

export default function LoginForm({
    initialData
}:{
    initialData: z.infer<typeof LoginUserSchema>
}) {

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
                    return(
                        <div>
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