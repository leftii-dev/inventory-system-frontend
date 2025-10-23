import React from "react";

export default function SubmitButton({children, disabled}: {children: React.ReactNode, disabled?: boolean}) {
return (
    <button
        type='submit'
        disabled={disabled}
        className='bg-brand-primary rounded-md px-2 text-white
                     md:transition-all md:duration-400 md:ease-in-out md:py-1 md:shadow md:hover:opacity-80
                     md:hover:cursor-pointer'
    >
        {children}
    </button>
)
}