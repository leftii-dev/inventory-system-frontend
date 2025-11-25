'use client'

import {
    BrandResponse,
    CategoryResponse,
    DiscountResponse,
    ProductResponse
} from "@/lib/products/product.types";
import {useEffect, useState} from "react";
import {useSession} from "@/lib/hooks/useSession";
import FormCard from "@/components/form/FormCard";
import {ApiResponseDto} from "@/lib/types/validation.types";
import FormInput from "@/components/form/FormInput";
import {createProduct, updateProduct} from "@/lib/products/product.actions";
import FormTextArea from "@/components/form/FormTextArea";
import FormSelectInput from "@/components/form/FormSelectInput";
import DynamicKeyValueInput from "@/components/form/DynamicKeyValueInput";
import SubmitButton from "@/components/SubmitButton";
import {getEmployeeByIdAction} from "@/lib/employee/employee.actions";
import {useRouter} from "next/navigation";
import {ActionResult} from "@/lib/utils/api.actions";

type FormProps = {
    isNew?: boolean;
    initialProduct: ApiResponseDto<ProductResponse>;
    categories: CategoryResponse[];
    brands: BrandResponse[];
    discounts: DiscountResponse[];
}

export default function ProductEditForm({isNew, initialProduct, categories, brands, discounts}: FormProps) {
    const [isElevated, setIsElevated] = useState<boolean>(false);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const [modifiedBy, setModifiedBy] = useState<string>('');
    const [createdBy, setCreatedBy] = useState<string>('');
    const {user} = useSession()
    const router = useRouter()

    const handleCreateAction = async (prevState: ActionResult<ProductResponse>, formData: FormData) => {
        const result = await createProduct(prevState, formData);
        if(result.ok && result.response?.data?.id) {
            router.push(`/dashboard/products/${result.response.data.id}`);
            return result;
        }
        return result;
    }

    console.log("PRODUCT:", initialProduct)

    const checkForChanges = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);

        let changed = false;

        if (formData.get('sku') !== initialProduct.data.sku) changed = true;
        if (formData.get('name') !== initialProduct.data.name) changed = true;
        if (formData.get('description') !== initialProduct.data.description) changed = true;
        if (formData.get('price') !== String(initialProduct.data.price)) changed = true;

        // Helper to normalize empty string and null as equivalent
        const normalizeValue = (val: string | null) => val || null;

        if (normalizeValue(formData.get('brandID') as string) !== normalizeValue(initialProduct.data.brandID)) changed = true;
        if (normalizeValue(formData.get('categoryID') as string) !== normalizeValue(initialProduct.data.categoryID)) changed = true;
        if (normalizeValue(formData.get('discountID') as string) !== normalizeValue(initialProduct.data.discountID)) changed = true;

        if ('cost' in initialProduct.data) {
            if (formData.get('cost') !== String(initialProduct.data.cost)) changed = true;
        }

        if ('weight' in initialProduct.data) {
            if (formData.get('weight') !== String(initialProduct.data.weight)) changed = true;
        }

        if ('dimensions' in initialProduct.data) {
            const dimensionsForm = formData.get('dimensions') as string;
            const dimensionsInitial = JSON.stringify(initialProduct.data.dimensions);
            if (dimensionsForm !== dimensionsInitial) changed = true;
        }

        if ('additionalDetails' in initialProduct.data) {
            const detailsForm = formData.get('additionalDetails') as string;
            const detailsInitial = JSON.stringify(initialProduct.data.additionalDetails);
            if (detailsForm !== detailsInitial) changed = true;
        }

        setHasChanges(changed);
    };

    useEffect(() => {
        if (user) {
            setIsElevated(user.roles.some(role => ['ADMIN', 'MANAGER'].includes(role)))
        }
    }, [user])

    useEffect(() => {
        const fetchEmployeeNames = async () => {
            if (isElevated && 'createdBy' in initialProduct.data) {
                const [createdResponse, modifiedResponse] = await Promise.all([
                    getEmployeeByIdAction(initialProduct.data.createdBy),
                    getEmployeeByIdAction(initialProduct.data.modifiedBy)
                ])
                if (createdResponse.ok) {
                    setCreatedBy(createdResponse.response.data.nameLast + ', ' + createdResponse.response.data.nameFirst);
                }
                if (modifiedResponse.ok) {
                    setModifiedBy(modifiedResponse.response.data.nameLast + ', ' + modifiedResponse.response.data.nameFirst);
                }
                console.log("modified:",modifiedResponse);
                console.log("created:",createdResponse);
            }
        }
        fetchEmployeeNames();
    }, [isElevated, initialProduct]);

    return (
            <FormCard<ProductResponse>
                action={isNew ? handleCreateAction : updateProduct}
                onChange={checkForChanges}
                onInput={checkForChanges}
                initialState={{
                    ok: true,
                    response: initialProduct,
                    errors: {}
                }}
            >
                {(state) => {
                    return(
                        <>
                            <div key={state.errors ? JSON.stringify(state.errors) : 'form-clean'} className={'flex flex-row w-full grow gap-x-8 mb-6'}>
                                <div
                                    className={'flex flex-col gap-4 w-2/3'}
                                >
                                    <FormInput
                                        label={'SKU'}
                                        name={'sku'}
                                        type={'text'}
                                        defaultValue={state.response?.data.sku || initialProduct.data.sku}
                                        error={state.errors?.sku || undefined}
                                        required={true}
                                        />
                                    <FormInput
                                        label={'Product Name'}
                                        name={'name'}
                                        type={'text'}
                                        defaultValue={state.response?.data.name || initialProduct.data.name}
                                        error={state.errors?.name || undefined}
                                        required={true}
                                    />
                                    <FormTextArea
                                        label={'Product Description'}
                                        name={'description'}
                                        type={'textarea'}
                                        defaultValue={state.response?.data.description || initialProduct.data.description}
                                        error={state.errors?.description || undefined}
                                    />
                                    <div className={'flex flex-row w-full justify-between gap-2'}>
                                        <FormSelectInput
                                            key={`brand-${state.response?.data.brandID ?? 'empty'}`}
                                            label={'Brand'}
                                            name={'brandID'}
                                            data={brands.map(brand => ({value: brand.id, label: brand.name}))}
                                            defaultValue={
                                                state.response?.data
                                                    ? (state.response.data.brandID ?? '')
                                                    : (initialProduct.data.brandID ?? '')
                                            }
                                            error={state.errors?.brandID || undefined}
                                        />
                                        <FormSelectInput
                                            key={`category-${state.response?.data.categoryID ?? 'empty'}`}
                                            label={'Category'}
                                            name={'categoryID'}
                                            data={categories.map(category => ({value: category.id, label: category.name}))}
                                            defaultValue={
                                                state.response?.data
                                                    ? (state.response.data.categoryID ?? '')
                                                    : (initialProduct.data.categoryID ?? '')
                                            }
                                            error={state.errors?.categoryID || undefined}
                                        />
                                        <FormSelectInput
                                            key={`discount-${state.response?.data.discountID ?? 'empty'}`}
                                            label={'Discount'}
                                            name={'discountID'}
                                            data={discounts.map(discount => ({value: discount.id, label: discount.name}))}
                                            defaultValue={
                                                state.response?.data
                                                    ? (state.response.data.discountID ?? '')
                                                    : (initialProduct.data.discountID ?? '')
                                            }
                                            error={state.errors?.discountID || undefined}
                                        />
                                    </div>
                                    <div className={'flex flex-row justify-start'}>
                                        <SubmitButton disabled={!hasChanges}>{!isNew ? 'Save Changes' : 'Save New Product'}</SubmitButton>
                                    </div>
                                </div>


                                <div className={'flex flex-col gap-4 mb-6'}>
                                    <div className={'flex flex-row justify-between'}>
                                        {'cost' in state.response?.data && 'cost' in initialProduct.data && (
                                            <FormInput
                                                label={'Cost'}
                                                name={'cost'}
                                                type={'number'}
                                                step={0.01}
                                                defaultValue={state.response?.data.cost || initialProduct.data.cost || ''}
                                                error={state.errors?.cost || undefined}
                                            />
                                        )
                                        }

                                        <FormInput
                                            label={'Price'}
                                            name={'price'}
                                            type={'number'}
                                            defaultValue={state.response?.data.price || initialProduct.data.price || ''}
                                            step={0.01}
                                            error={state.errors?.price || undefined}
                                        />
                                    </div>
                                    <div className={'flex flex-col gap-10 mb-6'}>
                                        <FormInput
                                            label={'Weight'}
                                            name={'weight'}
                                            type={'number'}
                                            defaultValue={
                                            'weight' in state.response?.data ? state.response?.data.weight
                                                : 'weight' in initialProduct.data ? initialProduct.data.weight : ''}
                                            step={0.01}
                                            error={state.errors?.weight || undefined}
                                        />

                                        <div className={'flex flex-col gap-6'}>
                                            <DynamicKeyValueInput
                                                label={'Product Dimensions'}
                                                name={'dimensions'}
                                                defaultValue={'dimensions' in state.response?.data ? state.response?.data.dimensions
                                                    : 'dimensions' in initialProduct.data ? initialProduct.data.dimensions :
                                                        {}}
                                                error={state.errors?.dimensions || undefined}
                                            />

                                            <DynamicKeyValueInput
                                                label={'Additional Details'}
                                                name={'additionalDetails'}
                                                defaultValue={'additionalDetails' in state.response?.data ? state.response?.data.additionalDetails
                                                    : 'additionalDetails' in initialProduct.data ? initialProduct.data.additionalDetails :
                                                    {}}
                                                error={state.errors?.additionalDetails || undefined}
                                            />
                                        </div>
                                        <input type={'hidden'} name={'id'} value={initialProduct.data.id}/>

                                    </div>
                                    {
                                        'active' in state.response.data && isElevated && (
                                            <div className={'flex flex-col justify-end mt-auto items-end'}>
                                                <span
                                                    className={'block mb-1 font-medium font-inter'}
                                                >
                                                    Created: {new Date(state.response.data.createdAt).toLocaleString()} - {createdBy ? createdBy : 'Fetching...'}
                                                </span>

                                                <span
                                                    className={'block mb-1 font-medium font-inter'}
                                                >
                                                    Last Modified: {new Date(state.response.data.modifiedAt).toLocaleString()} - {modifiedBy ? modifiedBy : 'Fetching...'}
                                                </span>




                                                <div className="flex justify-end items-center gap-x-2 p-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {state.response.data.active ? 'Active' : 'Inactive'}
                                                    </label>
                                                </div>
                                            </div>
                                        )
                                    }


                                </div>
                            </div>
                        </>
                    )
                }}
            </FormCard>
    )
}

//     weight: weightSchema,
//     dimensions: z.record(z.string(), z.unknown()),
//     additionalDetails: z.record(z.string(), z.unknown()),
