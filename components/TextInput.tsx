export default function TextInput({type, name, value, onChange, placeholder, required}: {type: string, name?:string, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, required?: boolean}) {
    return (
        <input
            type={type}
            className={`border border-gray-300 rounded-md p-2 w-full 
                        focus:outline-none
                        focus:ring-2
                        focus:ring-brand-secondary
                        focus:outline-transparent`}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required || false}
        />
    )
}
