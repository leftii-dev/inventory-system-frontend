import {getProducts} from "@/lib/products/product.actions";
import {getPurchaseOrder, getStatuses, getVendors} from "@/lib/inventory/inventory.actions";
import {PurchaseOrderResponse} from "@/lib/inventory/inventory.types";
import {emptyApiResponse} from "@/lib/types/validation.types";

export default async function DashboardPurchaseOrderDetailPage({params}: {params: {id: string}}) {
    const { id } = params
    const isNew = id === 'new'

    const [products, vendors, status, purchaseOrderResponse] = await Promise.all([
        getProducts(),
        getVendors(),
        getStatuses(),
        isNew ? Promise.resolve(null) : getPurchaseOrder(id)
    ])

    const newPO: PurchaseOrderResponse = {
        id: '',
        dateExpected: '',
        purchaseOrderCode: '',
        totalCost: 0,
        notes: '',
        vendor: {
            id: '',
            vendorCode: '',
            name: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            contactName: '',
            phone: '',
            email: ''
        },
        status: {
            id: '',
            name: '',
            description: ''
        }


    }

    const formInitialData = isNew
        ? emptyApiResponse<PurchaseOrderResponse>(newPO)
        : purchaseOrderResponse!.response;

    const purchaseOrder = !isNew ? purchaseOrderResponse!.response.data : null;
    return (
        <div className={`flex flex-row grow w-full border border-gray-300 shadow-lg`}>
            <div className={`flex flex-col flex-1 p-4`}>
                <PurchaseOrderEditForm
                    isNew={isNew}
                    initialData={newPO}
                />
            </div>
        </div>
    )
}