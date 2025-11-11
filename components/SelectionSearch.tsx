import {ProductFilters} from "@/lib/products/product.types";
import {JSX, useEffect, useState} from "react";

type SelectionSearchProps = {
    param: string;
    selections: {id: string, name: string}[],
    setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>
}

export default function SelectionSearch(
    {param, selections, setFilters}
    :
    SelectionSearchProps
): JSX.Element {
    const [value, setValue] = useState<string>('');

    useEffect(() => {
        const handleChange = setTimeout(() => {
                setFilters((prev) => ({...prev, [param]: value}))
            }, 300)

        return () => clearTimeout(handleChange)
    }, [param, setFilters, value]);
    return (
        <select
            name={param}
            id={param}
            onChange={(e) => setValue(e.target.value)}
        >
            <option value={''}></option>
            {selections.map(selection => (
                <option key={selection.id} value={selection.id}>{selection.name}</option>
            ))}
        </select>
    )

}
