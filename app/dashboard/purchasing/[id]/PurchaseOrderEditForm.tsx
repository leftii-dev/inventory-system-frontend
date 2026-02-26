'use client';

import {ApiResponseDto} from "@/lib/types/validation.types";
import {PurchaseOrderResponse, StatusResponse, VendorResponse} from "@/lib/inventory/inventory.types";
import FormCard from "@/components/form/FormCard";
import {deletePurchaseOrderByID, updatePurchaseOrder} from "@/lib/inventory/inventory.actions";
import {FormEvent, useState} from "react";
import FormInput from "@/components/form/FormInput";
import FormTextArea from "@/components/form/FormTextArea";
import SimpleButton from "@/components/SimpleButton";
import FormSelectInput from "@/components/form/FormSelectInput";
import StatusQuickAddButton from "@/components/inventory/status/StatusQuickAddButton";
import VendorQuickAddButton from "@/components/inventory/vendor/VendorQuickAddButton";
import {useRouter} from "next/navigation";

type FormProps = {
    initialData: ApiResponseDto<PurchaseOrderResponse>;
    initialVendors: VendorResponse[];
    initialStatuses: StatusResponse[];
}

export default function PurchaseOrderEditForm({initialData, initialVendors, initialStatuses}: FormProps) {
    const router = useRouter();
    const [hasChanges, setHasChanges] = useState(false);

    const [statuses, setStatuses] = useState<StatusResponse[]>(initialStatuses);
    const [vendors, setVendors] = useState<VendorResponse[]>(initialVendors);
    
    const [selectedStatusID, setSelectedStatusID] = useState<string>(initialData.data.status?.id || '');
    const [selectedVendorID, setSelectedVendorID] = useState<string>(initialData.data.vendor?.id || '');

    const initialPO = initialData.data;

    const checkForChanges = (e: FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        let changed = false;
        const normalizeValue = (val: string | null) => val || null;

        if(formData.get('dateExpected') !== initialPO.dateExpected) changed = true;
        if(formData.get('notes') !== initialPO.notes) changed = true;
        if(formData.get('totalCost') !== initialPO.totalCost) changed = true;

        if(normalizeValue(formData.get('vendorID') as string) !== normalizeValue(initialPO.vendor?.id)) changed = true;
        if(normalizeValue(formData.get('statusID') as string) !== normalizeValue(initialPO.status?.id)) changed = true;

        setHasChanges(changed);
    }

    const handleAddStatus = (newStatus: StatusResponse)=> {
        setStatuses(prev => [...prev, newStatus]);
        setSelectedStatusID(newStatus.id);
        setHasChanges(true);
    }
    
    const handleAddVendor = (newVendor: VendorResponse)=> {
        setVendors(prev => [...prev, newVendor]);
        setSelectedVendorID(newVendor.id);
        setHasChanges(true);
    }

    const handleDeletePO = async () => {
        if(confirm('Are you sure you want to delete this purchase order? This action cannot be undone.')) {
            await deletePurchaseOrderByID(initialPO.id);
            router.push('/dashboard/purchasing');
        }
    }

    return (
        <FormCard<PurchaseOrderResponse>
            action={updatePurchaseOrder}
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
                return (
                    <>
                        <div className={'flex flex-row justify-end mb-4'}>
                            <SimpleButton
                            type={'button'}
                            variant={'danger'}
                            onClick={handleDeletePO}>
                                Delete PO
                            </SimpleButton>
                        </div>
                        <div key={state.errors ? JSON.stringify(state.errors) : 'form-clean'}
                             className={`flex flex-col w-full grow gap-x-8 mb-6`}>
                            <div className={'flex flex-row justify-between gap-4 space-y-3'}>
                                <div id={'status-selector'} className={'flex flex-row gap-x-2 items-end'}>
                                    <FormSelectInput
                                        key={`status-${state.response?.data.status ?? 'empty'}`}
                                        label={'Status'}
                                        name={'statusID'}
                                        data={statuses.map(status => ({value: status.id, label: status.name}))}
                                        defaultValue={selectedStatusID || state.response.data?.status?.id || ''}
                                        onChange={(e) => setSelectedStatusID(e.target.value)}
                                        error={state.errors?.status || undefined}
                                    />
                                    <StatusQuickAddButton onStatusAdded={handleAddStatus}/>
                                </div>

                                <div id={'vendor-selector'} className={'flex flex-row gap-x-2 items-end'}>
                                    <FormSelectInput
                                        key={`vendor-${state.response?.data.vendor ?? 'empty'}`}
                                        label={'Vendor'}
                                        name={'vendorID'}
                                        data={vendors.map(vendor => ({value: vendor.id, label: vendor.name}))}
                                        defaultValue={selectedVendorID || state.response.data?.vendor?.id || ''}
                                        onChange={(e) => setSelectedVendorID(e.target.value)}
                                        error={state.errors?.vendor || undefined}
                                    />
                                    <VendorQuickAddButton onVendorAdded={handleAddVendor}/>
                                </div>

                                <div className={`flex flex-row justify-between gap-4 space-y-6`}>
                                    <FormInput
                                        label={'Expected Date'}
                                        name={'dateExpected'}
                                        type={'date'}
                                        defaultValue={state.response.data?.dateExpected || initialPO.dateExpected}
                                        error={state.errors?.dateExpected || undefined}
                                        required={true}
                                    />
                                </div>
                            </div>

                            <FormTextArea
                                label={'Notes'}
                                name={'notes'}
                                rows={3}
                                defaultValue={state.response.data?.notes || initialPO.notes || ''}
                                error={state.errors?.notes || undefined}
                            />

                        </div>
                        <input type={'hidden'} name={'id'} value={initialPO.id}/>
                        <div className={'flex flex-row justify-end'}>
                            <SimpleButton
                                type={'submit'}
                                variant={'primary'}
                                disabled={!hasChanges}
                            >
                                Save Changes
                            </SimpleButton>
                        </div>
                    </>
                );
            }}
        </FormCard>
    )
}