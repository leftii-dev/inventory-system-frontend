'use client';
import SimpleButton from "@/components/SimpleButton";
import {useState} from "react";
import Modal from "@/components/ui/Modal";
import {emptyApiResponse} from "@/lib/types/validation.types";
import FormInput from "@/components/form/FormInput";
import {ActionResult} from "@/lib/utils/api.actions";
import {Plus} from "lucide-react";
import {VendorResponse} from "@/lib/inventory/inventory.types";
import FormCard from "@/components/form/FormCard";
import {createVendor} from "@/lib/inventory/inventory.actions";

type Props = {
    onVendorAdded: (newVendor: VendorResponse) => void;
}

export default function VendorQuickAddButton({ onVendorAdded }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmission = async (prevState: ActionResult<VendorResponse>, formData: FormData): Promise<ActionResult<VendorResponse>> => {
        const result = await createVendor(prevState, formData);

        if(result.ok && result.response?.data) {
            onVendorAdded(result.response.data)
            setIsModalOpen(false);
        }
        return result;
    }

    return (
        <>
            <SimpleButton
                type="button"
                variant={'primary'}
                onClick={() => setIsModalOpen(true)}
            >
                <Plus />
            </SimpleButton>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={'Add New Brand'}
            >
                <FormCard<VendorResponse>
                    action={handleSubmission}
                    initialState={{
                        ok: true,
                        response: emptyApiResponse<VendorResponse>(),
                        errors: {}
                    }}
                >
                    {(state) => {
                        return (
                            <>
                                <FormInput
                                    name={'name'}
                                    label={'Vendor Name'}
                                    required
                                    defaultValue={state.response?.data.name || ''}
                                    error={state.errors?.name || undefined} />
                                <FormInput
                                    name={'addressLine1'}
                                    label={'Address Line 1'}
                                    defaultValue={state.response?.data.addressLine1 || ''}
                                    error={state.errors?.addressLine1 || undefined} />
                                <FormInput
                                    name={'addressLine2'}
                                    label={'Address Line 2'}
                                    defaultValue={state.response?.data.addressLine2 || ''}
                                    error={state.errors?.addressLine2 || undefined} />
                                <FormInput
                                    name={'city'}
                                    label={'City'}
                                    defaultValue={state.response?.data.city || ''}
                                    error={state.errors?.city || undefined} />
                                <FormInput
                                    name={'state'}
                                    label={'State'}
                                    defaultValue={state.response?.data.state || ''}
                                    error={state.errors?.state || undefined} />
                                <FormInput
                                    name={'zipCode'}
                                    label={'Zip Code'}
                                    defaultValue={state.response?.data.zipCode || ''}
                                    error={state.errors?.zipCode || undefined} />
                                <FormInput
                                    name={'contactName'}
                                    label={'Contact Name'}
                                    defaultValue={state.response?.data.contactName || ''}
                                    error={state.errors?.contactName || undefined} />
                                <FormInput
                                    name={'phone'}
                                    label={'Phone'}
                                    placeholder={'Enter 10 digit phone number (no dashes or parentheses)'}
                                    defaultValue={state.response?.data.phone || ''}
                                    error={state.errors?.phone || undefined} />
                                <FormInput
                                    name={'email'}
                                    label={'Email'}
                                    defaultValue={state.response?.data.email || ''}
                                    error={state.errors?.email || undefined} />
                                <SimpleButton
                                    type="submit"
                                    variant={'primary'}
                                    className={'mt-4 w-full'}
                                >
                                    Add Vendor
                                </SimpleButton>
                            </>
                        )
                    }}

                </FormCard>
            </Modal>
        </>
    )
}