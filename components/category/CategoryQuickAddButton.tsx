'use client';

import {CategoryResponse, DiscountResponse} from "@/lib/products/product.types";
import SimpleButton from "@/components/SimpleButton";
import {Plus} from "lucide-react";
import Modal from "@/components/ui/Modal";
import FormCard from "@/components/form/FormCard";
import {emptyApiResponse} from "@/lib/types/validation.types";
import FormTextArea from "@/components/form/FormTextArea";
import {useState} from "react";
import {ActionResult} from "@/lib/utils/api.actions";
import FormSelectInput from "@/components/form/FormSelectInput";
import FormInput from "@/components/form/FormInput";
import {createCategory} from "@/lib/products/product.actions";

type Props = {
    onCategoryAdded: (newCategory: CategoryResponse) => void;
    categories: CategoryResponse[];
    discounts: DiscountResponse[];
}

export default function CategoryQuickAddButton({ onCategoryAdded, categories, discounts }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmission = async (prevState: ActionResult<CategoryResponse>, formData: FormData): Promise<ActionResult<CategoryResponse>> => {
        const result = await createCategory(prevState, formData);

        if(result.ok && result.response?.data) {
            onCategoryAdded(result.response.data)
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
                title={'Add New Category'}
                >
                <FormCard<CategoryResponse>
                    action={handleSubmission}
                    initialState={{
                        ok: true,
                        response: emptyApiResponse<CategoryResponse>(),
                        errors: {}
                    }}
                >
                    {(state) => {
                        return (
                            <>
                                <FormInput
                                    name={'name'}
                                    label={'Category Name'}
                                    defaultValue={state.response?.data.name || ''}
                                    error={state.errors?.name || undefined}
                                    required
                                />
                                <FormTextArea
                                    name={'description'}
                                    label={'Description'}
                                    defaultValue={state.response?.data.description || ''}
                                    error={state.errors?.description || undefined}
                                />
                                <FormSelectInput
                                    label={'Category Discount'}
                                    name={'discountID'}
                                    data={discounts.map(discount => ({value: discount.id, label: discount.name}))}
                                    error={state.errors?.discountID || undefined}
                                />
                                <FormSelectInput
                                    label={'Parent Category'}
                                    data={categories.map(category => ({value: category.id, label: category.name}))}
                                    name={'parentCategoryID'}
                                />
                                <SimpleButton
                                    type="submit"
                                    variant={'primary'}
                                    className={'mt-4 w-full'}>
                                    Add Category
                                </SimpleButton>
                                </>
                        )
                    }}
                </FormCard>
            </Modal>
        </>
    )
}