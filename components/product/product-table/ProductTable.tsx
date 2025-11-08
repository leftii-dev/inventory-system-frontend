'use client'

import {
    BrandResponse,
    CategoryResponse,
    DiscountResponse,
    ProductFilters,
    ProductResponse
} from "@/lib/products/product.types";
import ProductLine from "@/components/product/product-table/ProductLine";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import StringSearch from "@/components/StringSearch";
import AboveBelowEqualsSearch from "@/components/AboveBelowEqualSearch";
import SelectionSearch from "@/components/SelectionSearch";
import {toQueryString} from "@/lib/utils/util.params";
import {getProducts} from "@/lib/products/product.actions";

export default function ProductTable(
    { initialProducts, categories, brands, discounts }
    :
    {initialProducts: ProductResponse[], categories: CategoryResponse[], brands: BrandResponse[], discounts: DiscountResponse[]}){
    const [products, setProducts] = useState<ProductResponse[]>(initialProducts);
    const router = useRouter();
    const params = useSearchParams();
    const [filters, setFilters] = useState<ProductFilters>({});

    const categoryPairs = categories.map(({id, name}) => ({id, name}));
    const brandPairs = brands.map(({id, name}) => ({id, name}));
    const discountPairs = discounts.map(({id, name}) => ({id, name}));

    useEffect(() => {
        const fetchProducts = async () => {
            const cleaned = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
            );
            const query = toQueryString(cleaned);
            router.push(`/dashboard${query}`);

            const res = await getProducts(cleaned);
            if (res.response?.data) setProducts(res.response.data);
        };

        fetchProducts();
    }, [filters, router]);

    return (
        <table className={`min-w-full border border-gray-300 rounded-lg overflow-hidden text-sm`}>
            <thead>
            <tr className={`divide-x divide-gray-300`}>
                <th>SKU</th>
                <th>Brand</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Code</th>
                <th>Category</th>
                <th>Retail</th>
                <th>Active Discount</th>
                <th>Main Image</th>
            </tr>
            </thead>
            <tbody>
            <tr className={`divide-x divide-gray-300 text-center border-b border-gray-300`}>
                <td><StringSearch minLength={2} maxLength={20} param={`skuContains`} filters={filters} setFilters={setFilters} /></td>
                <td><SelectionSearch param={`brand`} selections={brandPairs} setFilters={setFilters} /></td>
                <td colSpan={2}><StringSearch minLength={2} maxLength={50} param={`query`} filters={filters} setFilters={setFilters} /></td>
                <td><StringSearch param={`codeContains`} minLength={2} maxLength={10} filters={filters}  setFilters={setFilters} /></td>
                <td><SelectionSearch param={`category`} selections={categoryPairs} setFilters={setFilters} /></td>
                <td><AboveBelowEqualsSearch param={`price`} setFilters={setFilters} /></td>
                <td><SelectionSearch param={`discount`} selections={discountPairs} setFilters={setFilters} /></td>
                <td>
                    {'cost' in (products?.[0] || {}) ? (
                        <AboveBelowEqualsSearch param="cost" setFilters={setFilters} />
                    ) : null}
                </td>
            </tr>
            {products && (
                products.map((product) => {
                    return (
                        <ProductLine key={product.id} product={product} />
                    )
                })
            )}
            </tbody>
        </table>
    )
}