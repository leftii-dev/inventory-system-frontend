'use client'

import {PurchaseOrderItemResponse} from "@/lib/inventory/inventory.types";
import PurchasingItemCell from "@/components/purchasing/purchasing-item/purchasing-item-table/PurchasingItemCell";
import {Minus, Plus, Trash2} from "lucide-react";
import {useRef, useState} from "react";
import {updatePurchaseOrderItemById} from "@/lib/inventory/inventory.actions";

type Props = {
    item: PurchaseOrderItemResponse;
    handleRemoveItem: (id: string) => void;
    handleUpdateItem: (id: string, costUnit: number, quantity: number) => void;
}

export default function PurchasingItemLine({item, handleRemoveItem, handleUpdateItem}: Props) {
    const [quantity, setQuantity] = useState(item.quantity);
    const [committedCost, setCommittedCost] = useState(Number(item.costUnit));
    const [costInput, setCostInput] = useState(Number(item.costUnit).toFixed(2));

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const lineTotal = (committedCost * quantity).toFixed(2);

    const scheduleQuantityUpdate = (newCost: number, newQty: number) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            updatePurchaseOrderItemById(item.id, newCost, newQty, item.purchaseOrderID, item.product.id);
        }, 500);
    };

    const handleQuantityChange = (newQty: number) => {
        if (newQty < 1 || newQty > 10000) return;
        setQuantity(newQty);
        handleUpdateItem(item.id, committedCost, newQty);
        scheduleQuantityUpdate(committedCost, newQty);
    };

    const handleCostBlur = () => {
        const parsed = parseFloat(costInput);
        if (isNaN(parsed) || parsed < 0) {
            setCostInput(committedCost.toFixed(2));
            return;
        }
        const rounded = Math.round(parsed * 100) / 100;
        setCommittedCost(rounded);
        setCostInput(rounded.toFixed(2));
        handleUpdateItem(item.id, rounded, quantity);
        updatePurchaseOrderItemById(item.id, rounded, quantity, item.purchaseOrderID, item.product.id);
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <PurchasingItemCell className="px-4 py-3 font-mono text-gray-500">{item.product.productCode}</PurchasingItemCell>
            <PurchasingItemCell className="px-4 py-3 font-mono text-gray-500">{item.product.sku}</PurchasingItemCell>
            <PurchasingItemCell className="px-4 py-3 text-gray-600">{item.product.brandName}</PurchasingItemCell>
            <PurchasingItemCell className="px-4 py-3 font-medium text-gray-800">{item.product.name}</PurchasingItemCell>

            {/* Currency input for unit cost */}
            <td className="px-4 py-3">
                <div className="flex items-center border border-gray-200 rounded-md w-28 bg-white focus-within:ring-1 focus-within:ring-blue-300 focus-within:border-blue-300 transition-colors">
                    <span className="pl-2 text-gray-400 text-sm select-none">$</span>
                    <input
                        type="text"
                        inputMode="decimal"
                        value={costInput}
                        onChange={(e) => setCostInput(e.target.value)}
                        onBlur={handleCostBlur}
                        onFocus={(e) => e.target.select()}
                        className="w-full py-1.5 px-1 text-sm text-gray-700 focus:outline-none bg-transparent"
                    />
                </div>
            </td>

            {/* Quantity stepper */}
            <td className="px-4 py-3">
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden w-28 bg-white focus-within:ring-1 focus-within:ring-blue-300 focus-within:border-blue-300 transition-colors">
                    <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="px-2 py-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 border-r border-gray-200 transition-colors shrink-0"
                    >
                        <Minus className="w-3 h-3"/>
                    </button>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={quantity}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) handleQuantityChange(val);
                        }}
                        onFocus={(e) => e.target.select()}
                        className="w-full py-1.5 text-sm text-center text-gray-700 focus:outline-none bg-transparent"
                    />
                    <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="px-2 py-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 border-l border-gray-200 transition-colors shrink-0"
                    >
                        <Plus className="w-3 h-3"/>
                    </button>
                </div>
            </td>

            <PurchasingItemCell className="px-4 py-3 text-right font-medium text-gray-800">${lineTotal}</PurchasingItemCell>
            <td className="px-4 py-3 text-right">
                <Trash2
                    className="w-4 h-4 text-gray-400 hover:text-red-500 hover:cursor-pointer hover:scale-95 transition-colors ml-auto"
                    onClick={() => handleRemoveItem(item.id)}
                />
            </td>
        </tr>
    )
}
