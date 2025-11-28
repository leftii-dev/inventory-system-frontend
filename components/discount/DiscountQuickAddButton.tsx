'use client';

import {DiscountResponse} from "@/lib/products/product.types";
import {useState} from "react";
import {ActionResult} from "@/lib/utils/api.actions";
import { createDiscount } from "@/lib/products/product.actions";
import SimpleButton from "@/components/SimpleButton";
import {Plus} from "lucide-react";
import Modal from "@/components/ui/Modal";
import FormCard from "@/components/form/FormCard";
import {emptyApiResponse} from "@/lib/types/validation.types";
import FormInput from "@/components/form/FormInput";
import FormTextArea from "@/components/form/FormTextArea";

type Props = {
    onDiscountAdded: (newDiscount: DiscountResponse) => void;
}

export default function DiscountQuickAddButton({onDiscountAdded}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmission = async (prevState: ActionResult<DiscountResponse>, formData: FormData): Promise<ActionResult<DiscountResponse>> => {
        const result = await createDiscount(prevState, formData);

        if(result.ok && result.response?.data) {
            onDiscountAdded(result.response.data);
            setIsModalOpen(false);
        }
        return result;
    }

    return (
        <>
            <SimpleButton
                type={"button"}
                variant={"primary"}
                onClick={() => setIsModalOpen(true)}
            >
                <Plus />
            </SimpleButton>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Discount"
                >
                <FormCard
                    action={handleSubmission}
                    initialState={{
                        ok: true,
                        response: emptyApiResponse<DiscountResponse>(),
                        errors: {}
                    }}
                    >
                    {(state) => {
                        return(
                            <>
                                <FormInput
                                    name={'name'}
                                    label={'Discount Name'}
                                    defaultValue={state.response?.data.name || ''}
                                    error={state.errors?.name || undefined}
                                    required={true}
                                />
                                <FormTextArea
                                    name={'description'}
                                    label={'Discount Description'}
                                    defaultValue={state.response?.data.description || ''}
                                    error={state.errors?.description || undefined}
                                />
                                <FormInput
                                    name={'discountCode'}
                                    label={'Discount Code'}
                                    defaultValue={state.response?.data.discountCode || ''}
                                    error={state.errors?.discountCode || undefined}
                                    required={true}
                                />
                                <FormInput
                                    name={'discountPercentage'}
                                    label={'Discount Percentage'}
                                    type={'number'}
                                    step={0.01}
                                    min={0.0}
                                    max={100.0}
                                    defaultValue={state.response?.data.discountPercentage || ''}
                                    error={state.errors?.discountPercentage || undefined}
                                    required={true}
                                />
                                <FormInput
                                    name={'active'}
                                    label={'Discount Active?'}
                                    type={'checkbox'}
                                    defaultChecked={true}
                                    error={state.errors?.active || undefined}
                                />
                                <SimpleButton
                                    type="submit"
                                    variant={'primary'}
                                    className={'mt-4 w-full'}
                                >
                                    Add Discount
                                </SimpleButton>
                            </>
                        )
                    }}
                </FormCard>
            </Modal>
        </>
    )

}