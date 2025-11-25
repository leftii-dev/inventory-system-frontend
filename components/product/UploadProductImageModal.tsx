'use client'

import {useState} from "react";
import {PenSquare, Trash2, X, Star} from "lucide-react";
import { ProductImageResponse } from "@/lib/products/product.types";
import FormCard from "@/components/form/FormCard";
import { emptyApiResponse } from "@/lib/types/validation.types";
import FormInput from "@/components/form/FormInput";
import SubmitButton from "@/components/SubmitButton";
import {addProductImage, deleteProductImage, setDefaultImage} from "@/lib/products/product.actions";
import Image from 'next/image'
import {imageLoader} from "@/lib/utils/util.image";
import {useRouter} from "next/navigation";

interface Props {
    productId: string;
    image?: ProductImageResponse;
}

export default function UploadProductImageModal({ productId, image }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDefaultOpen, setIsDefaultOpen] = useState(false);
    const router = useRouter();

    const openModal = () => setIsOpen(true);
    const openDeleteModal = () => setIsDeleteOpen(true);
    const openDefaultModal = () => setIsDefaultOpen(true);
    const closeModals = () => {
        setIsOpen(false);
        setIsDeleteOpen(false);
        setIsDefaultOpen(false);
    }

    const handleSuccess = () => {
        closeModals();
        setTimeout(() => {
            router.refresh();
        }, 100);
    }

    return (
        <div className="relative group w-full h-full">
            {/* Product image */}

            {image && (
                <Image
                    loader={imageLoader}
                    src={image.imageUrl}
                    alt={image.altText}
                    blurDataURL={image.blurDataUrl ? image.blurDataUrl : undefined}
                    placeholder={image.blurDataUrl ? 'blur' : undefined}
                    className="rounded-xl w-full h-full object-contain"
                    fill
                />
            )}

            {/* Hover overlay icons */}
            <div
                className="
                    absolute left-1/2 bottom-[20%] -translate-x-1/2
                    flex items-center justify-center gap-2
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                "
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openModal();
                    }}
                    className="
                        bg-black/60 p-3 rounded-xl shadow-lg
                        hover:bg-black/80 transition-colors
                    "
                    type="button"
                >
                    <PenSquare className="h-8 w-8 text-white"/>
                </button>

                {image?.id && !image?.isDefault && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDefaultModal();
                        }}
                        className="
                            bg-black/60 p-3 rounded-xl shadow-lg
                            hover:bg-black/80 transition-colors
                        "
                        type="button"
                    >
                        <Star className="h-8 w-8 text-white"/>
                    </button>
                )}

                {image?.id && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal();
                        }}
                        className="
                            bg-black/60 p-3 rounded-xl shadow-lg
                            hover:bg-black/80 transition-colors
                        "
                        type="button"
                    >
                        <Trash2 className='h-8 w-8 text-white'/>
                    </button>
                )}
            </div>

            {/* Set Default Modal overlay */}
            {isDefaultOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={closeModals}
                >
                    <div
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModals}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            type="button"
                        >
                            <X className="h-5 w-5"/>
                        </button>

                        <div className="relative mx-auto w-24 aspect-square border border-brand-primary rounded-lg flex-shrink-0 overflow-hidden bg-white">
                            {image && (
                                <Image
                                    loader={imageLoader}
                                    src={image.imageUrl}
                                    alt={image.altText}
                                    fill
                                    blurDataURL={image.blurDataUrl ? image.blurDataUrl : undefined}
                                    placeholder={image.blurDataUrl ? 'blur' : undefined}
                                    className="object-contain p-1"
                                />
                            )}
                        </div>

                        <h2 className="text-lg font-semibold text-center my-4">
                            Set as Default Image?
                        </h2>

                        <FormCard<unknown>
                            action={setDefaultImage}
                            initialState={{
                                ok: true,
                                response: emptyApiResponse<unknown>(),
                                errors: {},
                            }}
                            onSuccess={handleSuccess}
                        >
                            {(state) => (
                                <div className={'flex justify-between gap-2'}>
                                    <SubmitButton>
                                        <p>Set as Default</p>
                                    </SubmitButton>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            closeModals();
                                        }}
                                        type={'button'}
                                        className={'transition-colors ease-in-out duration-200 hover:cursor-pointer hover:bg-brand-secondary rounded-lg py-1 px-2'}
                                    >
                                        Cancel
                                    </button>
                                    <input type={'hidden'} name={'productId'} value={productId}/>
                                    <input type={'hidden'} name={'imageId'} value={image?.id}/>
                                </div>
                            )}
                        </FormCard>
                    </div>
                </div>
            )}

            {/* Delete Image Modal overlay */}
            {isDeleteOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={closeModals}
                >
                    <div
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModals}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            type="button"
                        >
                            <X className="h-5 w-5"/>
                        </button>

                        <div
                            className="relative mx-auto w-24 aspect-square border border-brand-primary rounded-lg flex-shrink-0 overflow-hidden bg-white">
                            {image && (
                                <Image
                                    loader={imageLoader}
                                    src={image.imageUrl}
                                    alt={image.altText}
                                    fill
                                    blurDataURL={image.blurDataUrl ? image.blurDataUrl : undefined}
                                    placeholder={image.blurDataUrl ? 'blur' : undefined}
                                    className="object-contain p-1"
                                />
                            )}
                        </div>

                        <FormCard<unknown>
                            action={deleteProductImage}
                            initialState={{
                                ok: true,
                                response: emptyApiResponse<unknown>(),
                                errors: {},
                            }}
                            onSuccess={handleSuccess}
                        >
                            {(state) => (
                                <div className={'flex justify-between'}>
                                    <SubmitButton>
                                        <p>Delete</p>
                                    </SubmitButton>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            closeModals();
                                        }}
                                        type={'button'}
                                        className={'transition-colors ease-in-out duration-200 hover:cursor-pointer hover:bg-brand-secondary rounded-lg py-1 px-2'}
                                    >
                                        Cancel
                                    </button>
                                    <input type={'hidden'} name={'productId'} value={productId}/>
                                    <input type={'hidden'} name={'productImageId'} value={image?.id}/>
                                </div>
                            )}
                        </FormCard>
                    </div>
                </div>
            )}

            {/* Replace Image Modal overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={closeModals}
                >
                    <div
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModals}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            type="button"
                        >
                            <X className="h-5 w-5"/>
                        </button>

                        <div
                            className="relative mx-auto w-24 aspect-square border border-brand-primary rounded-lg flex-shrink-0 overflow-hidden bg-white">
                            {image && (
                                <Image
                                    loader={imageLoader}
                                    src={image.imageUrl}
                                    alt={image.altText}
                                    fill
                                    blurDataURL={image.blurDataUrl ? image.blurDataUrl : undefined}
                                    placeholder={image.blurDataUrl ? 'blur' : undefined}
                                    className="object-contain p-1"
                                />
                            )}
                        </div>

                        <FormCard<ProductImageResponse>
                            action={addProductImage}
                            initialState={{
                                ok: true,
                                response: emptyApiResponse<ProductImageResponse>(),
                                errors: {},
                            }}
                            onSuccess={handleSuccess}
                        >
                            {(state) => (
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-center mb-2">
                                        Upload Product Image
                                    </h2>

                                    <FormInput
                                        label=""
                                        type="file"
                                        name="imageUrl"
                                        error={state.errors?.imageUrl}
                                    />
                                    <FormInput
                                        label="Make default?"
                                        type="checkbox"
                                        defaultChecked={false}
                                        name="isDefault"
                                        error={state.errors?.isDefault}
                                    />
                                    <FormInput
                                        label="Alt Text"
                                        type="text"
                                        name="altText"
                                        error={state.errors?.altText}
                                    />
                                    <FormInput
                                        label="Image Type"
                                        name="imageType"
                                        type="text"
                                        error={state.errors?.imageType}
                                    />
                                    <SubmitButton>Upload</SubmitButton>

                                    <input type="hidden" name="productId" value={productId}/>
                                    <input type="hidden" name="originalUrl" value={image?.imageUrl ?? ''}/>
                                    <input type="hidden" name="productImageId" value={image?.id ?? ''}/>
                                    <input type="hidden" name="displayOrder" value={0} />
                                </div>
                            )}
                        </FormCard>
                    </div>
                </div>
            )}
        </div>
    );
}