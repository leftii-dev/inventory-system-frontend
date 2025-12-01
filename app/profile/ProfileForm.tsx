// /app/profile/ProfileForm.tsx
'use client';

import {updateSelfAction} from "@/lib/users/users.actions";
import SubmitButton from "@/components/SubmitButton";
import {ActionResult} from "@/lib/utils/api.actions";
import FormInput from "@/components/form/FormInput";
import FormCard from "@/components/form/FormCard";
import Image from "next/image";
import {UserResponse} from "@/lib/users/users.types";
import {ApiResponseDto} from "@/lib/types/validation.types";

export default function ProfileForm({
    initialData
}: {
    initialData: ApiResponseDto<UserResponse>
}) {

    return (
        <FormCard<UserResponse>
            action={updateSelfAction}
            initialState={{
                ok: true,
                response: initialData,
                errors: {}
            }}
            confirmMessage={'Are you sure you want to update your profile?'}
        >
            {(state) => (
                <div className={'flex flex-col gap-2'}>
                    {state.ok && (
                        <div className={`mx-auto relative w-24 h-24 rounded-full overflow-hidden`}>
                            <Image
                                className={`object-cover`}
                                src={
                                    state.response?.data?.pictureUrl ??
                                    initialData.data?.pictureUrl ??
                                    '/images/default_user.svg'}
                                alt={'User Picture'}
                                fill
                            />
                        </div>
                    )
                    }
                    <FormInput
                        key={`email-${state.ok}`}
                        name={'email'}
                        label={'Email'}
                        type={'email'}
                        defaultValue={state.ok ? state.response?.data?.email : initialData.data?.email}
                        error={state.ok ? undefined : state.errors?.email}
                    />
                    <FormInput
                        key={`name-${state.ok}`}
                        name={'name'}
                        label={'Name'}
                        type={'text'}
                        defaultValue={state.ok ? state.response?.data?.name : initialData.data?.name}
                        error={state.ok ? undefined : state.errors?.name}
                    />
                    <FormInput
                        key={`password-${state.ok}`}
                        name={'password'}
                        label={'Change Password (For Email/Password Login)'}
                        type={'password'}
                        defaultValue={''}
                        error={state.ok ? undefined : state.errors?.password}
                    />
                    <FormInput
                        key={`confirmPassword-${state.ok}`}
                        name={'confirmPassword'}
                        label={'Confirm Password Change'}
                        type={'password'}
                        defaultValue={''}
                        error={state.ok ? undefined : state.errors?.confirmPassword}
                    />
                    <SubmitButton>
                        Update
                    </SubmitButton>
                </div>
            )}

        </FormCard>
    )
}