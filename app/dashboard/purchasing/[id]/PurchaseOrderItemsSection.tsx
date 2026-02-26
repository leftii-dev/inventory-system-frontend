'use client'

import {PurchaseOrderItemResponse} from "@/lib/inventory/inventory.types";
import {emptyApiResponse} from "@/lib/types/validation.types";
import PurchaseOrderItemAddForm from "@/app/dashboard/purchasing/[id]/PurchaseOrderItemAddForm";
import {useState} from "react";
import PurchasingItemLine from "@/components/purchasing/purchasing-item/purchasing-item-table/PurchasingItemLine";
import {deletePurchaseOrderItemByID} from "@/lib/inventory/inventory.actions";

type Props = {
    initialItems: PurchaseOrderItemResponse[];
    purchaseOrderId: string;
}

export default function PurchaseOrderItemsSection({initialItems, purchaseOrderId}: Props) {
    const [currentItems, setCurrentItems] = useState<PurchaseOrderItemResponse[]>(initialItems ?? []);
    const [totalCost, setTotalCost] = useState<number>(initialItems.reduce((acc, item) => acc + (Number(item.costUnit) * item.quantity), 0));

    const handleAddItem = (newItem: PurchaseOrderItemResponse) => {
        const updated = [...currentItems, newItem];
        setCurrentItems(updated);
        setTotalCost(updated.reduce((acc, item) => acc + (Number(item.costUnit) * item.quantity), 0))
    }

    const handleRemoveItem = async (id: string) => {
        const updated = currentItems.filter(item => item.id !== id);
        setCurrentItems(updated);
        setTotalCost(updated.reduce((acc, item) => acc + (Number(item.costUnit) * item.quantity), 0))
        await deletePurchaseOrderItemByID(id);
    }

    const handleUpdateItem = (id: string, costUnit: number, quantity: number) => {
        const updated = currentItems.map(item =>
            item.id === id ? {...item, costUnit, quantity} : item
        );
        setCurrentItems(updated);
        setTotalCost(updated.reduce((acc, item) => acc + (Number(item.costUnit) * item.quantity), 0));
    }

    return (
        <>
            <PurchaseOrderItemAddForm
                initialData={emptyApiResponse<PurchaseOrderItemResponse>()}
                purchaseOrderId={purchaseOrderId}
                onSuccess={handleAddItem}
            >
                <div className="mt-6 rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-4 py-3 font-medium">Item Code</th>
                            <th className="px-4 py-3 font-medium">SKU</th>
                            <th className="px-4 py-3 font-medium">Brand</th>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Cost</th>
                            <th className="px-4 py-3 font-medium">Qty</th>
                            <th className="px-4 py-3 font-medium text-right">Line Total</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {currentItems.length > 0
                            ? currentItems.map(item => (
                                <PurchasingItemLine key={item.id} item={item} handleRemoveItem={handleRemoveItem} handleUpdateItem={handleUpdateItem}/>
                            ))
                            : (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">
                                        No items added yet.
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                    <div className="flex justify-end px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-500 mr-4">Total</span>
                        <span className="text-sm font-semibold text-gray-800">
                            ${totalCost.toFixed(2)}
                        </span>
                    </div>
                </div>
            </PurchaseOrderItemAddForm>

        </>
    )
}