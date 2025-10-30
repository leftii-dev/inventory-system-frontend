// /app/auth/login/LoginForm.tsx
'use client';

import FormCard from "@/components/form/FormCard";
import {ActionResult} from "@/lib/utils/api.actions";
import {LoginUserSchema} from "@/lib/auth/auth.schemas";
import {z} from "zod";

type LoginActionResult = ActionResult<typeof LoginUserSchema>

export default function LoginForm({
    initialData
}:{
    initialData: z.infer<typeof LoginUserSchema>
}) {

    return (
        <FormCard<LoginActionResult>
            action={loginAction}
            initialState={{
                success: true,
                data: initialData,
            }}
        >
            {(state) => (
                <div>
                </div>
            )}
        </FormCard>
    )
}