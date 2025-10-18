
export default function SubmitButton({text}: {text: string}) {
return (
    <button
        type='submit'
        className='bg-brand-primary rounded-md px-2 text-white
                     md:transition-all md:duration-400 md:ease-in-out md:py-1 md:shadow md:hover:opacity-80
                     md:hover:cursor-pointer'
    >
        {text}
    </button>
)
}