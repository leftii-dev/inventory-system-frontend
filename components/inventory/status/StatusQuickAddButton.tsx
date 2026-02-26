'use client';
import SimpleButton from "@/components/SimpleButton";
import {useState} from "react";
import Modal from "@/components/ui/Modal";
import {emptyApiResponse} from "@/lib/types/validation.types";
import FormInput from "@/components/form/FormInput";
import {ActionResult} from "@/lib/utils/api.actions";
import {Plus} from "lucide-react";
import {StatusResponse} from "@/lib/inventory/inventory.types";
import FormCard from "@/components/form/FormCard";
import {createStatus, createVendor} from "@/lib/inventory/inventory.actions";

type Props = {
    onStatusAdded: (newStatus: StatusResponse) => void;
}

export default function VendorQuickAddButton({ onStatusAdded }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmission = async (prevState: ActionResult<StatusResponse>, formData: FormData): Promise<ActionResult<StatusResponse>> => {
        const result = await createStatus(prevState, formData);

        if(result.ok && result.response?.data) {
            onStatusAdded(result.response.data)
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
                <FormCard<StatusResponse>
                    action={handleSubmission}
                    initialState={{
                        ok: true,
                        response: emptyApiResponse<StatusResponse>(),
                        errors: {}
                    }}
                >
                    {(state) => {
                        return (
                            <>
                                <FormInput
                                    name={'name'}
                                    label={'Status Name'}
                                    required
                                    defaultValue={state.response?.data.name || ''}
                                    error={state.errors?.name || undefined} />
                                <FormInput
                                    name={'description'}
                                    label={'Status Description'}
                                    defaultValue={state.response?.data.description || ''}
                                    error={state.errors?.description || undefined} />
                                <SimpleButton
                                    type="submit"
                                    variant={'primary'}
                                    className={'mt-4 w-full'}
                                >
                                    Add Brand
                                </SimpleButton>
                            </>
                        )
                    }}

                </FormCard>
            </Modal>
        </>
    )
}