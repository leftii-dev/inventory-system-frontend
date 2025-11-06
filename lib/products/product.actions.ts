import {ProductResponse} from "@/lib/products/product.types";
import {ActionResult, apiAction} from "@/lib/utils/api.actions";

export async function getProducts(): Promise<ActionResult<ProductResponse[]>> {
    const response = await apiAction<ProductResponse[]>({
        endpoint: '/products',
    })

    console.log(response);
    return response;
}