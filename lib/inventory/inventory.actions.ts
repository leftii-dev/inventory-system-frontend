'use server';

import {ActionResult, apiAction} from "@/lib/utils/api.actions";
import {PurchaseOrderResponse} from "@/lib/inventory/inventory.types";

export async function getPurchaseOrders(): Promise<ActionResult<PurchaseOrderResponse[]>> {
    return await apiAction<PurchaseOrderResponse[]>({
        endpoint: "/purchase-orders",
        method: 'GET',
        requireAuth: true,
    })
}