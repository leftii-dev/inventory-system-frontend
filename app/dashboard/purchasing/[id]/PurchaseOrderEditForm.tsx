'use client';

import {ApiResponseDto} from "@/lib/types/validation.types";
import {PurchaseOrderResponse} from "@/lib/inventory/inventory.types";
import FormCard from "@/components/form/FormCard";
import {ActionResult} from "@/lib/utils/api.actions";
import {useRouter} from "next/navigation";

type FormProps = {
    isNew?: boolean;
    initialData: ApiResponseDto<PurchaseOrderResponse>;
}

export default function PurchaseOrderEditForm({isNew, initialData}: FormProps) {
    const router = useRouter();
    const handleCreationAction = async (prevState: ActionResult<PurchaseOrderResponse>, formData: FormData) => {
        const result = await createPurchaseOrder(prevState, formData);
        if(result.ok && result.response?.data?.id) {
            router.push(`/dashboard/purchases/${result.data.id}`);
            return result;
        }
        return result;
    }


    return (
        <FormCard<PurchaseOrderResponse>
            action={isNew ? handleCreationAction : updatePurchaseOrder}
            onChange={checkForChanges}
            onInput={checkForChanges}
            onSuccess={() => setHasChanges(false)}
            initialState={{
                ok: true,
                response: initialData,
                errors: {}
            }}
            >
            {(state) => {
                return(
                    <div>Working!</div>
                )
            }}
        </FormCard>
    )
}