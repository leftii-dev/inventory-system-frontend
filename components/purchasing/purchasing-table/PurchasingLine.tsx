'use client'

import {PurchaseOrderResponse} from "@/lib/inventory/inventory.types";
import {useRouter} from "next/navigation";
import PurchasingCell from "@/components/purchasing/purchasing-table/PurchasingCell";

export default function PurchasingLine({purchaseOrder}: {purchaseOrder: PurchaseOrderResponse}){
    const router = useRouter();
    const triggerNavigation = () => {
        router.push(`/dashboard/purchasing/${purchaseOrder.id}`);
    }

    return (
        <>
            <tr
                className={`text-center divide-x divide-gray-300 whitespace-nowrap overflow-hidden max-h-5 hover:border hover:border-brand-primary odd:bg-gray-100 hover:cursor-pointer`}
                onClick={triggerNavigation}
            >
                <PurchasingCell>{purchaseOrder.purchaseOrderCode}</PurchasingCell>
                <PurchasingCell>{purchaseOrder.vendor?.name || ''}</PurchasingCell>
                <PurchasingCell>{purchaseOrder.dateExpected}</PurchasingCell>
                <PurchasingCell>{purchaseOrder.status?.name || ''}</PurchasingCell>
                <PurchasingCell className={'text-end'}>{purchaseOrder.totalCost}</PurchasingCell>
            </tr>
        </>
    )
}