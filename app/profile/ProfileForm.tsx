'use client';

import {SelfUpdateUserSchema} from "@/lib/users/users.schemas";
import {updateSelfAction} from "@/lib/users/users.actions";
import {z} from "zod";
import SubmitButton from "@/components/SubmitButton";
import {ActionResult} from "@/lib/utils/api.actions";
import FormInput from "@/components/form/FormInput";
import FormCard from "@/components/form/FormCard";
import Image from "next/image";

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
            {(state) => (
                <>
                    {state.success && (
                        <div className={`mx-auto relative w-24 h-24 rounded-full overflow-hidden`}>
                            <Image
                                className={`object-cover`}
                                src={state.data.pictureUrl || initialData.pictureUrl || '/images/default_user.svg'}
                                alt={'User Picture'}
                                fill
                            />
                        </div>
                    )
                    }
                    <FormInput
                        key={`email-${state.success}`}
                        name={'email'}
                        label={'Email'}
                        type={'email'}
                        defaultValue={state.success ? state.data?.email : initialData.email}
                        error={state.success ? undefined : state.errors?.email}
                    />
                    <FormInput
                        key={`name-${state.success}`}
                        name={'name'}
                        label={'Name'}
                        type={'text'}
                        defaultValue={state.success ? state.data?.name : initialData.name}
                        error={state.success ? undefined : state.errors?.name}
                    />
                    <FormInput
                        key={`password-${state.success}`}
                        name={'password'}
                        label={'Change Password (For Email/Password Login)'}
                        type={'password'}
                        defaultValue={''}
                        error={state.success ? undefined : state.errors?.password}
                    />
                    <FormInput
                        key={`confirmPassword-${state.success}`}
                        name={'confirmPassword'}
                        label={'Confirm Password Change'}
                        type={'password'}
                        defaultValue={''}
                        error={state.success ? undefined : state.errors?.confirmPassword}
                    />
                    <SubmitButton>
                        Update
                    </SubmitButton>
                </>
            )}

        </FormCard>
    )
}