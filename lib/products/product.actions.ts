import {BrandResponse, CategoryResponse, DiscountResponse, ProductResponse} from "@/lib/products/product.types";
import {ActionResult, apiAction} from "@/lib/utils/api.actions";
import {toQueryString} from "@/lib/utils/util.params";

export async function getProducts(
    searchParams?: Record<string, string | string[] | undefined>
): Promise<ActionResult<ProductResponse[]>> {
    const endpoint = `/products${searchParams ? toQueryString(searchParams) : ''}`
    const res = await apiAction<ProductResponse[]>({
        endpoint: endpoint,
    });
    console.log(endpoint)
    console.log(res.response);
    return res;
}

export async function getCategories(): Promise<ActionResult<CategoryResponse[]>> {
    return await apiAction<CategoryResponse[]>({
        endpoint: `/categories`,
    });
}

export async function getBrands(): Promise<ActionResult<BrandResponse[]>> {
    return await apiAction<BrandResponse[]>({
        endpoint: `/brands`
    });
}

export async function getDiscounts(): Promise<ActionResult<DiscountResponse[]>> {
    return await apiAction<DiscountResponse[]>({
        endpoint: `/discounts`,
    })
}