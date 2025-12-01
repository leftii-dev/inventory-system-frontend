import {getPurchaseOrders} from "@/lib/inventory/inventory.actions";

export default async function PurchasingPage(){
    const poListRes = await getPurchaseOrders();
    console.log(poListRes);
    const poList = poListRes.response.data

    console.log(poList);

    return (
        <div className={'flex flex-row gap-4'}>
            <div id={'sidebar-search-list'} className={'flex flex-col gap-4'}>
                <h2 className={'font-inter text-lg font-medium'}>
                    Purchase Order List
                </h2>
                <div className={'flex flex-col gap-4'}>
                    {poList && (
                        poList.map((po) => (
                            <div className={'flex flex-row outline gap-4'} key={po.id}>
                                {po.purchaseOrderCode} - {po.dateExpected} - {po.status.name} - {po.totalCost} - {po.vendor.name}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}