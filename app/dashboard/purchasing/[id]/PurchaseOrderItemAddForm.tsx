'use client'

import {PurchaseOrderItemResponse} from "@/lib/inventory/inventory.types";
import {ApiResponseDto} from "@/lib/types/validation.types";
import FormCard from "@/components/form/FormCard";
import {createPurchaseOrderItem} from "@/lib/inventory/inventory.actions";
import ProductQuickSelectSearch from "@/components/purchasing/purchasing-item/ProductQuickSelectSearch";
import SimpleButton from "@/components/SimpleButton";
import {useState} from "react";

type FormProps = {
    initialData: ApiResponseDto<PurchaseOrderItemResponse>;
    purchaseOrderId: string;
    onSuccess?: (newItem: PurchaseOrderItemResponse) => void;
    children?: React.ReactNode;
}

export default function PurchaseOrderItemAddForm({initialData, purchaseOrderId, onSuccess, children}: FormProps) {
    const [formKey, setFormKey] = useState(0);
    const handleSuccess = (newItem: PurchaseOrderItemResponse)=> {
        setFormKey(prev => prev + 1);
        if (onSuccess) {
            onSuccess(newItem)
        }
    }
    return (
        <FormCard<PurchaseOrderItemResponse>
            action={createPurchaseOrderItem}
            onSuccess={handleSuccess}
            showStatus={false}
            initialState={{
                ok: true,
                response: initialData,
                errors: {}
            }}
            >
            {(state) => {
                return (
                    <>
                        <input type={'hidden'} name={'purchaseOrderID'} value={purchaseOrderId}/>
                        <ProductQuickSelectSearch
                            key={formKey}
                            productError={state.errors?.productID}
                            quantityError={state.errors?.quantity}
                            costUnitError={state.errors?.costUnit}
                            actions={
                                <SimpleButton type="submit" variant={'primary'}>
                                    + Add
                                </SimpleButton>
                            }
                        />
                        {children}
                    </>
                )
            }}

        </FormCard>
    )
}