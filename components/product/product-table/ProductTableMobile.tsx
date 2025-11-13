'use client'

import {BrandResponse, CategoryResponse, DiscountResponse, ProductResponse} from "@/lib/products/product.types";
import Image from "next/image";
import {imageLoader} from "@/lib/utils/util.image";
import {Funnel} from "lucide-react";
import {useState} from "react";
import {createPortal} from "react-dom";

type Props = {
    initialProducts: ProductResponse[],
    categories: CategoryResponse[],
    brands: BrandResponse[],
    discounts: DiscountResponse[]
}

export default function ProductTableMobile(
    {
        initialProducts,
        categories,
        brands,
        discounts
    }: Props) {
    const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);

    return (
        <div className={'flex flex-col gap-2 font-inter'}>
            {initialProducts.map((product) => {
                const defaultImage = product.images.find(img => img.isDefault)

                return (
                    <div key={product.id} className={'p-3 border border-gray-300 shadow shadow-brand-primary rounded-lg '}>
                        <div className={'flex flex-row justify-between'}>
                            <div className={'relative w-32 h-32 rounded-lg bg-brand-primary'}>
                                <Image
                                    loader={imageLoader}
                                    src={defaultImage?.imageUrl ?? '/images/product-placeholder.svg'}
                                    alt={defaultImage?.altText ?? 'Default Image'}
                                    fill
                                    placeholder={defaultImage?.blurDataUrl ? "blur" : undefined}
                                    blurDataURL={defaultImage?.blurDataUrl ? defaultImage.blurDataUrl : undefined}
                                    className={'object-contain'}
                                />
                            </div>

                            <p className={'font-mono'}>{product.sku}</p>
                        </div>

                        <p>{product.brandName} - {product.name}</p>
                        <p>{product.description}</p>
                        <div className={'flex flex-row justify-between'}>
                            <p>${product.price}</p>
                            {product.discountName && (
                                <p>Discount: {product.discountName}</p>
                            )}
                        </div>
                    </div>

                )}
            )}

            {isOpenFilter && createPortal(
                <div
                    className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
                    onClick={() => setIsOpenFilter(prevState => !prevState)}
                >
                </div>,document.body
            )}

            <button
                onClick={() => setIsOpenFilter(prevState => !prevState)}
                className={`
                    ${isOpenFilter ? 'hidden' : ''}
                    fixed bottom-6 right-6 z-50 bg-brand-primary text-white
                    p-4 rounded-full shadow-lg hover:bg-brand-secondary active:scale-95
                    transition-all duration-200 touch-manipulation md:hidden
                `}
                type={'button'}
                aria-label={'Open Filters'}
                >
                    <Funnel className={`h-6 w-6`} />
            </button>
        </div>
    )
}