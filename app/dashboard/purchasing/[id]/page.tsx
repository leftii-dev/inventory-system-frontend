import {
    createBlankPurchaseOrder,
    getPurchaseOrder, getPurchaseOrderItems,
    getStatuses,
    getVendors
} from "@/lib/inventory/inventory.actions";

import PurchaseOrderEditForm from "@/app/dashboard/purchasing/[id]/PurchaseOrderEditForm";
import {redirect} from "next/navigation";
import PurchaseOrderItemsSection from "@/app/dashboard/purchasing/[id]/PurchaseOrderItemsSection";
import SimpleButton from "@/components/SimpleButton";

export default async function DashboardPurchaseOrderDetailPage({params}: {params: Promise<{id: string}>}) {
    const { id } = await params
    const isNew = id === 'new'

    const [purchaseOrderItems, vendors, statuses, purchaseOrderResponse] = await Promise.all([
        getPurchaseOrderItems(id),
        getVendors(),
        getStatuses(),
        isNew ? Promise.resolve(null) : getPurchaseOrder(id)
    ])

    if(isNew) {
        const result = await createBlankPurchaseOrder();
        redirect(`/dashboard/purchasing/${result.response?.data?.id}`);
    }

    const formInitialData = purchaseOrderResponse!.response;
    const initialItems = purchaseOrderItems!.response ?? [];

    return (
        <div className={`flex flex-row grow w-full border border-gray-300 shadow-lg`} >
            <div className={`flex flex-col flex-1 p-4`}>
                <PurchaseOrderEditForm
                    initialData={formInitialData}
                    initialVendors={vendors.response?.data}
                    initialStatuses={statuses.response?.data}
                />
                <PurchaseOrderItemsSection initialItems={initialItems.data} purchaseOrderId={id}/>
            </div>
        </div>
    )
}