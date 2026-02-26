'use server';

import {ActionResult, apiAction} from "@/lib/utils/api.actions";
import {
    PurchaseOrderItemResponse,
    PurchaseOrderResponse,
    StatusResponse,
    VendorResponse
} from "@/lib/inventory/inventory.types";
import {PurchaseOrderItemRequestSchema, PurchaseOrderRequestSchema} from "@/lib/inventory/inventory.schema";
import {toQueryString} from "@/lib/utils/util.params";

export async function getPurchaseOrders(
    searchParams?: Record<string, string | string[] | undefined>
): Promise<ActionResult<PurchaseOrderResponse[]>> {
    const endpoint = `/purchase-orders${searchParams ? toQueryString(searchParams) : ''}`
    return await apiAction<PurchaseOrderResponse[]>({
        endpoint: endpoint,
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

export async function createVendor(
    prevState: ActionResult<VendorResponse>,
    formData: FormData
): Promise<ActionResult<VendorResponse>> {
    return await apiAction<VendorResponse>({
        endpoint: "/vendors",
        method: 'POST',
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
        schema: PurchaseOrderRequestSchema,
        endpoint: "/purchase-orders",
        method: 'POST',
        requireAuth: true,
        numberFields: ['totalCost']
    }, formData)
}

export async function createBlankPurchaseOrder(): Promise<ActionResult<PurchaseOrderResponse>> {
    return await apiAction<PurchaseOrderResponse>({
        endpoint: "/purchase-orders",
        method: 'POST',
        requireAuth: true,
    })
}

export async function updatePurchaseOrder(
    prevState: ActionResult<PurchaseOrderResponse>,
    formData: FormData
): Promise<ActionResult<PurchaseOrderResponse>> {
    return await apiAction<PurchaseOrderResponse>({
        schema: PurchaseOrderRequestSchema,
        endpoint: `/purchase-orders/${formData.get("id")}`,
        method: 'PUT',
        requireAuth: true,
    }, formData)
}

export async function deletePurchaseOrderByID(
    id: string
): Promise<ActionResult<unknown>> {
    return await apiAction<unknown>({
        endpoint: `/purchase-orders/${id}`,
        method: 'DELETE',
        requireAuth: true,
    });
}

export async function createStatus(
    prevState: ActionResult<StatusResponse>,
    formData: FormData
): Promise<ActionResult<StatusResponse>> {
    return await apiAction<StatusResponse>({
        endpoint: "/status",
        method: 'POST',
        requireAuth: true,
    })
}

export async function createPurchaseOrderItem(
    prevState: ActionResult<PurchaseOrderItemResponse>,
    formData: FormData
): Promise<ActionResult<PurchaseOrderItemResponse>> {
    return await apiAction<PurchaseOrderItemResponse>({
        endpoint: `/purchase-order-items`,
        schema: PurchaseOrderItemRequestSchema,
        method: 'POST',
        numberFields: ['costUnit', 'quantity'],
        requireAuth: true,
    }, formData)
}

export async function deletePurchaseOrderItem(
    prevState: ActionResult<unknown>,
    formData: FormData
): Promise<ActionResult<unknown>> {
    return await apiAction<unknown>({
        endpoint: `/purchase-order-items/${formData.get("id")}`,
        method: 'DELETE',
        requireAuth: true,
    }, formData);
}

export async function deletePurchaseOrderItemByID(
    id: string
): Promise<ActionResult<unknown>> {
    return await apiAction<unknown>({
        endpoint: `/purchase-order-items/${id}`,
        method: 'DELETE',
        requireAuth: true,
    });
}

export async function updatePurchaseOrderItemById(
    id: string,
    costUnit: number,
    quantity: number,
    purchaseOrderID: string,
    productID: string,
): Promise<ActionResult<PurchaseOrderItemResponse>> {
    return await apiAction<PurchaseOrderItemResponse>({
        endpoint: `/purchase-order-items/${id}`,
        method: 'PUT',
        requireAuth: true,
        extraData: { costUnit, quantity, purchaseOrderID, productID },
    });
}

export async function updatePurchaseOrderItem(
    prevState: ActionResult<PurchaseOrderItemResponse>,
    formData: FormData
): Promise<ActionResult<PurchaseOrderItemResponse>> {
    return await apiAction<PurchaseOrderItemResponse>({
        endpoint: `/purchase-order-items/${formData.get("id")}`,
        method: 'PUT',
        requireAuth: true,
    }, formData)
}

export async function getPurchaseOrderItems(
    purchaseOrderID: string
): Promise<ActionResult<PurchaseOrderItemResponse[]>> {
    return await apiAction<PurchaseOrderItemResponse[]>({
        endpoint: `/purchase-order-items/by-purchase-order/${purchaseOrderID}`,
        method: 'GET',
        requireAuth: true,
    })
}