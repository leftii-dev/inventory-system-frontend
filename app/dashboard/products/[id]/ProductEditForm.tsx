'use client'

import {ProductResponse} from "@/lib/products/product.types";
import {useEffect, useState} from "react";
import {useSession} from "@/lib/hooks/useSession";
import FormCard from "@/components/form/FormCard";
import {ApiResponseDto} from "@/lib/types/validation.types";
import FormInput from "@/components/form/FormInput";
import {updateProduct} from "@/lib/products/product.actions";

type FormProps = {
    initialProduct: ApiResponseDto<ProductResponse>;
}

export default function ProductEditForm({initialProduct}: FormProps) {
    const [isElevated, setIsElevated] = useState(false);
    const {user} = useSession()
    useEffect(() => {
        if (user) {
            setIsElevated(user.roles.some(role => ['ADMIN', 'MANAGER'].includes(role)))
        }
    }, [user])

    return (
        <div className={'flex flex-row grow w-full border border-gray-300 rounded-r-lg'}>
            <FormCard<ProductResponse>
                action={updateProduct}
                initialState={{
                    ok: true,
                    response: initialProduct,
                    errors: {}
                }}
            >
                {(state) => {
                    return(
                        <>
                            <div id={'prod-edit-left'}
                                 className={'flex flex-col h-full w-2/3 bg-brand-primary'}>
                                <FormInput
                                    label={'Product Name'}
                                    name={'name'}
                                    type={'text'}
                                    defaultValue={state.response?.data.name || ''}/>
                            </div>
                            <div id={'prod-edit-right'}
                                 className={'flex flex-col h-full w-1/3 bg-brand-secondary rounded-r-lg'}>

                            </div>
                        </>
                    )
                }}
            </FormCard>
        </div>
    )
}