'use server';

import {ActionResult, apiAction} from "@/lib/utils/api.actions";
import {PurchaseOrderResponse, StatusResponse, VendorResponse} from "@/lib/inventory/inventory.types";

export async function getPurchaseOrders(): Promise<ActionResult<PurchaseOrderResponse[]>> {
    return await apiAction<PurchaseOrderResponse[]>({
        endpoint: "/purchase-orders",
        method: 'GET',
        requireAuth: true,
    })
}

export async function getPurchaseOrder(id: string): Promise<ActionResult<PurchaseOrderResponse>> {
    return await apiAction<PurchaseOrderResponse>({
        endpoint: `/purchase-orders/${id}`,
        method: 'GET',
        requireAuth: true,
    })
}

export async function getVendors(): Promise<ActionResult<VendorResponse[]>> {
    return await apiAction<VendorResponse[]>({
        endpoint: "/vendors",
        method: 'GET',
        requireAuth: true,
    })
}

export async function getStatuses(): Promise<ActionResult<StatusResponse[]>> {
    return await apiAction<StatusResponse[]>({
        endpoint: "/status",
        method: 'GET',
        requireAuth: true,
    })
}

export async function createPurchaseOrder(
    prevState: ActionResult<PurchaseOrderResponse>,
    formData: FormData
): Promise<ActionResult<PurchaseOrderResponse>> {
    return await apiAction<PurchaseOrderResponse>({
        schema:
    })
}