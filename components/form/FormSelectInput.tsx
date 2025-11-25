'use client';

type FormSelectInputProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    name: string,
    label: string,
    data: { value: string; label: string }[],
    error?: string
}

export default function FormSelectInput(
    {
        name,
        label,
        data,
        error,
        defaultValue,
        ...rest
    }: FormSelectInputProps
) {
    return (
        <div>
            <label htmlFor={name} className={`block mb-1 font-medium font-inter`}>
                {label}
            </label>
            <select
                id={name}
                name={name}
                defaultValue={defaultValue}
                {...rest}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                    error ? 'border-red-500' : 'border-gray-300'}
                    `}
            >
                <option value={''}></option>
                {data.map((item, i) => (
                    <option key={i} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}