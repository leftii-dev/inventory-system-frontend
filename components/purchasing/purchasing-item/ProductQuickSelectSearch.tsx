'use client'

import {useEffect, useState} from "react";
import {Search, X} from "lucide-react";
import {ProductResponse} from "@/lib/products/product.types";
import {getProducts} from "@/lib/products/product.actions";
import FormInput from "@/components/form/FormInput";

type Props = {
    productError?: string;
    quantityError?: string;
    costUnitError?: string;
    actions?: React.ReactNode;
}

export default function ProductQuickSelectSearch({productError, quantityError, costUnitError, actions}: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ProductResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            setIsLoading(true);
            const res = await getProducts({query});
            if (res.response?.data) setResults(res.response.data);
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (product: ProductResponse) => {
        setSelectedProduct(product);
        setResults([]);
        setQuery('');
    };

    const handleClear = () => {
        setSelectedProduct(null);
        setQuery('');
        setResults([]);
    };

    return (
        <div className="flex flex-col gap-3">
            <input type="hidden" name="productID" value={selectedProduct?.id ?? ''}/>

            {!selectedProduct ? (
                <div>
                    <label className="block mb-1 font-medium font-inter">Product</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, SKU, or code..."
                            className={`w-full border rounded px-3 py-2 pl-9 pr-9 focus:outline-none focus:ring ${
                                productError ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {query.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {setQuery(''); setResults([]);}}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        )}
                    </div>
                    {productError && <p className="text-red-600 text-sm mt-1">{productError}</p>}

                    {isLoading && (
                        <p className="text-sm text-gray-500 mt-1 px-1">Searching...</p>
                    )}
                    {!isLoading && results.length > 0 && (
                        <ul className="border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto divide-y divide-gray-100">
                            {results.map((product) => (
                                <li
                                    key={product.id}
                                    onClick={() => handleSelect(product)}
                                    className="flex gap-4 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                >
                                    <span className="text-gray-500 font-mono">{product.productCode}</span>
                                    <span className="text-gray-500 font-mono">{product.sku}</span>
                                    <span className="text-gray-700">{product.brandName}</span>
                                    <span className="font-medium">{product.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {!isLoading && query.length >= 2 && results.length === 0 && (
                        <p className="text-sm text-gray-500 mt-1 px-1">No products found.</p>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="block mb-1 font-medium font-inter">Product</label>
                        <div className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-gray-50">
                            <div className="flex gap-4 text-sm">
                                <span className="text-gray-500 font-mono">{selectedProduct.productCode}</span>
                                <span className="text-gray-500 font-mono">{selectedProduct.sku}</span>
                                <span className="text-gray-700">{selectedProduct.brandName}</span>
                                <span className="font-medium">{selectedProduct.name}</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-sm text-blue-600 hover:underline ml-4 shrink-0"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                    <div className="flex items-end gap-4">
                        <FormInput
                            label="Quantity"
                            name="quantity"
                            type="number"
                            min={1}
                            max={10000}
                            required
                            error={quantityError}
                        />
                        <FormInput
                            label="Cost / Unit"
                            name="costUnit"
                            type="number"
                            step="0.01"
                            min={0}
                            defaultValue={"cost" in selectedProduct ? selectedProduct?.cost ?? '' : 0}
                            required
                            error={costUnitError}
                        />
                        {actions}
                    </div>
                </div>
            )}
        </div>
    );
}
