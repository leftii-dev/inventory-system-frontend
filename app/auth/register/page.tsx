'use client';

import { useState, FormEvent} from "react";
import { registerUserAction } from "@/lib/auth/auth.actions";
import { extractErrors} from "@/lib/utils/validate";
import { RegisterUserSchema } from "@/lib/auth/auth.schemas";
import TextInput from "@/components/TextInput";
import SubmitButton from "@/components/SubmitButton";
import { z } from "zod";

type FormErrors = Partial<Record<keyof z.input<typeof RegisterUserSchema>, string>>;

export default function RegisterPage() {
    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState<string>("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        const form = e.currentTarget;

        const formData = new FormData(form);
        const result = await registerUserAction(formData);

        if(!result.success) {
            setErrors(extractErrors(result.errors));
        } else {
            setSuccessMessage("Registration successful! Check your email to verify your account.");
            form.reset();
        }
    }

    return (
        <div className={`border border-gray-300 rounded-lg shadow-lg p-6 max-w-md mx-auto mt-10`}>
            <h1 className={`font-inter text-2xl font-bold mb-4`}>New User</h1>
            {successMessage && (
                <div className={`mb-4 p-2 bg-green-100 text-green-800 rounded`}>
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className={`mb-4`}>
                    <label htmlFor="email" className={`block mb-1 font-medium`}>Email</label>
                    <TextInput type={`email`} name={`email`} placeholder={'Enter your email'} required={true} />
                    {errors.email && (
                        <p className={`text-red-600 text-sm mt-1`}>{errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className={`block mb-1 font-medium`}>Password</label>
                    <TextInput type={`password`} name={`password`} placeholder={'Create a strong password'} required={true} />
                    {errors.password && (
                        <p className={`text-red-600 text-sm mt-1`}>{errors.password}</p>
                    )}
                </div>

                <div className={`mb-4`}>
                    <label htmlFor="confirmPassword" className={`block mb-1 font-medium`}>Confirm Password</label>
                    <TextInput type={`password`} name={`confirmPassword`} placeholder={'Re-enter your password'} required={true} />
                    {errors.confirmPassword && (
                        <p className={`text-red-600 text-sm mt-1`}>{errors.confirmPassword}</p>
                    )}
                </div>

                <div className={`mb-4`}>
                    <label htmlFor={`name`} className={`block mb-1 font-medium`}>Full Name</label>
                    <TextInput type={`text`} name={`name`} placeholder={'Enter your full name'} required={true} />
                    {errors.name && (
                        <p className={`text-red-600 text-sm mt-1`}>{errors.name}</p>
                    )}
                </div>
                <div>
                    <SubmitButton text={`Register`} />
                </div>
            </form>

        </div>
    );
}