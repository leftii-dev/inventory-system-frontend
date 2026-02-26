import {getPurchaseOrders, getStatuses, getVendors} from "@/lib/inventory/inventory.actions";
import AddButton from "@/components/ui/AddButton";
import PurchasingTable from "@/components/purchasing/purchasing-table/PurchasingTable";
import {getParam} from "@/lib/utils/util.params";

export default async function PurchasingPage({
    searchParams
                                             }:{
    searchParams: Promise<Record<string, string | string[] | undefined>>
}){
    const resolvedParams = await searchParams;
    const params = resolvedParams ?? {};

    const filters = {
        codeContains: getParam(params, "codeContains"),
        dateExpected: getParam(params, "dateExpected"),
        totalLessThan: getParam(params, "totalLessThan"),
        totalGreaterThan: getParam(params, "totalGreaterThan"),
        vendor: getParam(params, "vendor"),
        status: getParam(params, "status")
    };

    const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
    );

    const [purchaseOrders, vendors, statuses] = await Promise.all([
        getPurchaseOrders(cleanedFilters),
        getVendors(),
        getStatuses()
    ]);


    return (
        <div className={'relative h-[75vh] w-full border border-gray-300 rounded-r-lg bg-white shadow-sm'}>
            <div id={'sidebar-search-list'} className={'flex flex-col gap-4'}>
                <div className={'flex flex-col gap-4 bg-brand-primary'}>
                    <PurchasingTable initialPurchaseOrders={purchaseOrders.response.data} vendors={vendors.response.data} statuses={statuses.response.data} />
                    <AddButton href={'/dashboard/purchasing/new'} />
                </div>
            </div>
        </div>
    )
}