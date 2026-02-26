import {JSX, useEffect, useState} from "react";
import {ChevronDown} from "lucide-react";

type SelectionSearchProps<T> = {
    param: string;
    selections: {id: string, name: string}[],
    setFilters: React.Dispatch<React.SetStateAction<T>>
}

export default function SelectionSearch<T>(
    {param, selections, setFilters}
    :
    SelectionSearchProps<T>
): JSX.Element {
    const [value, setValue] = useState<string>('');

    useEffect(() => {
        const handleChange = setTimeout(() => {
                setFilters((prev) => ({...prev, [param]: value}))
            }, 300)

        return () => clearTimeout(handleChange)
    }, [param, setFilters, value]);
    return (
        <div className="relative w-full">
            <select
                name={param}
                id={param}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full appearance-none p-1 text-xs text-center pr-5 cursor-pointer"
            >
                <option value={''}></option>
                {selections.toSorted((a, b) => a.name.localeCompare(b.name)).map(selection => (
                    <option key={selection.id} value={selection.id}>{selection.name}</option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
        </div>
    )

}
