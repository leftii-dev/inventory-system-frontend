'use client';

import {SelfUpdateUserSchema} from "@/lib/users/users.schemas";
import {updateSelfAction} from "@/lib/users/users.actions";
import {z} from "zod";
import SubmitButton from "@/components/SubmitButton";
import {ActionResult} from "@/lib/utils/api.actions";
import FormInput from "@/components/form/FormInput";
import FormCard from "@/components/form/FormCard";

export default function ProfileForm({
    initialData
}: {
    initialData: z.infer<typeof SelfUpdateUserSchema>
}) {

    return (
        <FormCard<ActionResult<typeof SelfUpdateUserSchema>>
            action={updateSelfAction}
            initialState={{
                success: true,
                data: initialData
            }}
            confirmMessage={'Are you sure you want to update your profile?'}
        >
            {(state, isPending) => (
                <>
                    <FormInput
                        name={'email'}
                        label={'Email'}
                        type={'email'}
                        defaultValue={state.success ? state.data?.email : ''}
                        error={state.success ? undefined : state.errors?.email}
                    />
                    <FormInput
                        name={'name'}
                        label={'Name'}
                        type={'text'}
                        defaultValue={state.success ? state.data?.name : ''}
                        error={state.success ? undefined : state.errors?.name}
                    />
                    <FormInput
                        name={'password'}
                        label={'Change Password'}
                        type={'password'}
                        defaultValue={''}
                        error={state.success ? undefined : state.errors?.password}
                    />
                    <FormInput
                        name={'confirmPassword'}
                        label={'Confirm Password Change'}
                        type={'confirmPassword'}
                        defaultValue={''}
                        error={state.success ? undefined : state.errors?.confirmPassword}
                    />
                    <SubmitButton disabled={isPending}>
                        {isPending ? 'Updating...' : 'Update'}
                    </SubmitButton>
                </>
            )}

        </FormCard>
    )
}