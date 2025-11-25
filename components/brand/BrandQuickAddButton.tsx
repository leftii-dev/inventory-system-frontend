'use client';
import SimpleButton from "@/components/SimpleButton";
import {useState} from "react";
import Modal from "@/components/ui/Modal";
import {BrandResponse} from "@/lib/products/product.types";
import FormCard from "../form/FormCard";
import {createBrand} from "@/lib/products/product.actions";
import {emptyApiResponse} from "@/lib/types/validation.types";
import FormInput from "@/components/form/FormInput";
import FormTextArea from "@/components/form/FormTextArea";
import {ActionResult} from "@/lib/utils/api.actions";
import {Plus} from "lucide-react";

type Props = {
    onBrandAdded: (newBrand: BrandResponse) => void;
}

export default function BrandQuickAddButton({ onBrandAdded }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmission = async (prevState: ActionResult<BrandResponse>, formData: FormData): Promise<ActionResult<BrandResponse>> => {
        const result = await createBrand(prevState, formData);

        if(result.ok && result.response?.data) {
            onBrandAdded(result.response.data)
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
                <FormCard<BrandResponse>
                    action={handleSubmission}
                    initialState={{
                        ok: true,
                        response: emptyApiResponse<BrandResponse>(),
                        errors: {}
                    }}
                >
                    {(state) => {
                        return (
                            <>
                                <FormInput
                                    name={'name'}
                                    label={'Brand Name'}
                                    required
                                    defaultValue={state.response?.data.name || ''}
                                    error={state.errors?.name || undefined} />
                                <FormTextArea
                                    name={'description'}
                                    label={'Brand Description'}
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