type TextInputProps = {
    type: string;
    name?: string;
    defaultValue?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}

export default function TextInput({type, name, defaultValue, value, onChange, placeholder, required} : TextInputProps) {
    return (
        <input
            type={type}
            className={`border border-gray-300 rounded-md p-2 w-full 
                        focus:outline-none
                        focus:ring-2
                        focus:ring-brand-secondary
                        focus:outline-transparent`}
            name={name}
            defaultValue={defaultValue}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required || false}
        />
    )
}
