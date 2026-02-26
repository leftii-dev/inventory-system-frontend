'use client'

import {
    PurchaseOrderFilters,
    PurchaseOrderResponse,
    StatusResponse,
    VendorResponse
} from "@/lib/inventory/inventory.types";
import {startTransition, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {toQueryString} from "@/lib/utils/util.params";
import {getPurchaseOrders} from "@/lib/inventory/inventory.actions";
import StringSearch from "@/components/StringSearch";
import DateSearch from "@/components/DateSearch";
import SelectionSearch from "@/components/SelectionSearch";
import AboveBelowEqualsSearch from "@/components/AboveBelowEqualSearch";
import PurchasingLine from "@/components/purchasing/purchasing-table/PurchasingLine";

type Props = {
    initialPurchaseOrders: PurchaseOrderResponse[],
    vendors: VendorResponse[],
    statuses: StatusResponse[]
}

export default function PurchasingTable(
    {initialPurchaseOrders, vendors, statuses}
    :
    Props
) {
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderResponse[]>(initialPurchaseOrders);
    const router = useRouter();
    const searchParams = useSearchParams();
    const validKeys = [
        'codeContains',
        'dateExpected',
        'totalLessThan',
        'totalGreaterThan',
        'vendor',
        'status'
    ] as const;

    type ValidFilterKey = typeof validKeys[number];

    const [filters, setFilters] = useState<PurchaseOrderFilters>(() => {
        const initial: PurchaseOrderFilters = {};
        for (const [key, value] of searchParams.entries()) {
            if (value && validKeys.includes(key as ValidFilterKey)) {
                initial[key as keyof PurchaseOrderFilters] = value;
            }
        }
        return initial;
    });

    const vendorPairs = vendors.map(({id, name}) =>({id, name}));
    const statusPairs = statuses.map(({id, name}) => ({id, name}));

    useEffect(() => {
        const timer = setTimeout(async () => {
            const cleaned = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v != null && v !== '')
            );

            const query = toQueryString(cleaned);

            startTransition(() => {
                router.replace(`/dashboard/purchasing${query}`, { scroll: false });
            });

            try {
                const res = await getPurchaseOrders(cleaned);
                if (res.response?.data) {
                    setPurchaseOrders(res.response.data);
                }
            } catch (err) {
                console.error(err);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [filters, router]);

    return (
        <div className="relative h-[75vh] w-full border border-gray-300 rounded-r-lg bg-white shadow-sm">
            <div className={'h-full w-full overflow-auto'}>
                <table className={`min-w-full max-w-full table-fixed text-sm`}>
                    <thead className={'sticky top-0 bg-white z-10'}>
                    <tr className={`divide-x divide-gray-300 border-t border-gray-300 bg-brand-primary`}>
                        <th className={'p-2'}>PO#</th>
                        <th className={'p-2'}>Vendor</th>
                        <th className={'p-2'}>Date Expected</th>
                        <th className={'p-2'}>Status</th>
                        <th className={'p-2'}>Total Cost</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr className={`divide-x divide-gray-300 bg-green-100 text-center border-b border-gray-300`}>
                            <td><StringSearch param={'codeContains'} filters={filters} setFilters={setFilters} minLength={3} maxLength={10} /></td>
                            <td><SelectionSearch param={'vendor'} selections={vendorPairs} setFilters={setFilters} /></td>
                            <td><DateSearch param={'dateExpected'} filters={filters} setFilters={setFilters} /></td>
                            <td><SelectionSearch param={'status'} selections={statusPairs} setFilters={setFilters} /></td>
                            <td><AboveBelowEqualsSearch param={'totalCost'} setFilters={setFilters} /></td>
                        </tr>
                        {purchaseOrders && purchaseOrders.length > 0 ? (
                            purchaseOrders.map((purchaseOrder) => {
                                return (
                                    <PurchasingLine key={purchaseOrder.id} purchaseOrder={purchaseOrder} />
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className={'p-10 text-center text-gray-500'}>
                                    No Purchase Orders found. Clear filters or use the + button to add one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}