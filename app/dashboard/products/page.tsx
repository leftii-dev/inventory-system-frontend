import {getBrands, getCategories, getDiscounts, getProducts} from "@/lib/products/product.actions";
import {ProductFilters} from "@/lib/products/product.types";
import {getParam} from "@/lib/utils/util.params";
import ResponsiveProductTable from "@/components/product/product-table/ResponsiveProductTable";

export default async function DashboardProductsPage({
                                                searchParams
                                            }:{
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
    const resolvedParams = await searchParams;
    const params = resolvedParams ?? {};

    const filters: ProductFilters = {
        skuContains: getParam(params, 'skuContains'),
        codeContains: getParam(params, 'codeContains'),
        query: getParam(params, 'query'),
        costEqual: getParam(params, 'costEqual'),
        costBelow: getParam(params, 'costBelow'),
        costAbove: getParam(params, 'costAbove'),
        priceEqual: getParam(params, 'priceEqual'),
        priceBelow: getParam(params, 'priceBelow'),
        priceAbove: getParam(params, 'priceAbove'),
        category: getParam(params, 'category'),
        discount: getParam(params, 'discount'),
        brand: getParam(params, 'brand')
    };

    const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
    );


    const [products, categories, brands, discounts] = await Promise.all([
        getProducts(cleanedFilters),
        getCategories(),
        getBrands(),
        getDiscounts()
    ]);

    return (
        <div>
            <ResponsiveProductTable
                initialProducts={products.response.data}
                categories={categories.response.data}
                brands={brands.response.data}
                discounts={discounts.response.data}
            />
        </div>
    );
}
