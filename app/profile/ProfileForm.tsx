'use client';
import {useState, FormEvent} from "react";
import TextInput from "@/components/TextInput";
import {UserRequestSchema, UserResponse} from "@/lib/users/users.schemas";
import {updateSelfAction} from "@/lib/users/users.actions";
import {extractErrors} from "@/lib/utils/validate";
import {z} from "zod";
import SubmitButton from "@/components/SubmitButton";

type FormProps = {
    user: UserResponse;
    errors?: Record<string, string>;
}

type FormErrors = Partial<Record<keyof z.input<typeof UserRequestSchema>, string>>;

export default function ProfileForm({user, errors}: FormProps) {
    const [err, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState<string>("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const confirm = window.confirm('Are you sure you want to update your profile details?');
        if(!confirm) {
            return;
        }
        if(errors){
            setErrors(errors);
        } else {
            setErrors({});
        }

        setSuccessMessage('');

        const form = e.currentTarget;

        const formData = new FormData(form);
        const result = await updateSelfAction(formData);

        if(!result.success) {
            setErrors(extractErrors(result.errors));
        } else {
            setSuccessMessage("Your details have been successfully updated.");
        }
    }
    return (
            <form onSubmit={handleSubmit} className={`w-full max-w-lg bg-white p-8 rounded-lg shadow-md border border-gray-300`}>
                {successMessage && (
                    <div className={`mb-4 p-2 bg-green-100 text-green-800 rounded`}>
                        {successMessage}
                    </div>
                )}
                <div className={`mb-4`}>
                    <label htmlFor="email" className={`block mb-1 font-medium`}>Email</label>
                    <TextInput type={`email`} name={`email`} defaultValue={user.email} />
                    {err.email && (
                        <p className={`text-red-600 text-sm mt-1`}>{err.email}</p>
                    )}
                </div>

                <div className={`mb-4`}>
                    <label htmlFor="name" className={`block mb-1 font-medium`}>Name</label>
                    <TextInput type={`text`} name={`name`} defaultValue={user.name} />
                    {err.name && (
                        <p className={`text-red-600 text-sm mt-1`}>{err.name}</p>
                    )}
                </div>


                <div className={`mb-4`}>
                    <label htmlFor="password" className={`block mb-1 font-medium`}>Change Password</label>
                    <TextInput type={`password`} name={`password`} defaultValue={''} placeholder={'Enter new password'} />
                    {err.password && (
                        <p className={`text-red-600 text-sm mt-1`}>{err.password}</p>
                    )}
                </div>

                <div className={`mb-4`}>
                    <label htmlFor="confirmPassword" className={`block mb-1 font-medium`}>Confirm New Password</label>
                    <TextInput type={`password`} name={`confirmPassword`} defaultValue={''} placeholder={'Confirm new password'}/>
                    {err.confirmPassword && (
                        <p className={`text-red-600 text-sm mt-1`}>{err.confirmPassword}</p>
                    )}
                </div>

                <SubmitButton text={`Update User`} />
            </form>
    )
}