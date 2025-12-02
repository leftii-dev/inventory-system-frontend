'use client'

import {ProductResponse} from "@/lib/products/product.types";
import Image from "next/image";
import ProductCell from "@/components/product/product-table/ProductCell";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {createPortal} from "react-dom";
import AboveBelowEqualsSearch from "@/components/AboveBelowEqualSearch";
import {imageLoader} from "@/lib/utils/util.image";
import {formatPrice} from "@/lib/utils/util.prices.converter";


export default function ProductLine({product}: {product: ProductResponse}) {
    const [zoom, setZoom] = useState(false);
    const router = useRouter();
    const defaultImage = product.images?.find(img => img.isDefault);
    const triggerNavigation = () => {
        router.push(`/dashboard/products/${product.id}`);
    }
    return (
        <>
            <tr
                className={`text-center divide-x divide-gray-300 whitespace-nowrap overflow-hidden max-h-5 hover:border hover:border-brand-primary odd:bg-gray-100 hover:cursor-pointer`}
                onClick={triggerNavigation}
            >
                    <ProductCell>{product.sku}</ProductCell>
                    <ProductCell>{product.brandName}</ProductCell>
                    <ProductCell>{product.name}</ProductCell>
                    <ProductCell>{product.productCode}</ProductCell>
                    <ProductCell>{product.categoryName}</ProductCell>
                    {'cost' in product && (
                        <ProductCell className={'text-end'}>{formatPrice(product.cost)}</ProductCell>
                    )}
                    <ProductCell className={'text-end'}>{formatPrice(product.price)}</ProductCell>
                    <ProductCell>{product.discountName}</ProductCell>

                <ProductCell>
                    <div className={`relative w-full h-10`}>
                        <Image
                            src={defaultImage?.imageUrl ?? `/images/product-placeholder.svg`}
                            alt={defaultImage?.altText ?? `Placeholder for missing product image`}
                            fill
                            placeholder={defaultImage?.blurDataUrl ? "blur" : undefined}
                            blurDataURL={defaultImage?.blurDataUrl ? defaultImage.blurDataUrl : undefined}
                            loader={imageLoader}
                            className={`object-contain hover:scale-95`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setZoom(true);
                            }}
                        />
                    </div>
                </ProductCell>
            </tr>
            {zoom &&
                createPortal(
                    <div
                        className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
                        onClick={() => setZoom(false)}
                    >
                        <Image
                            src={defaultImage?.imageUrl ?? '/images/product-placeholder.svg'}
                            alt={defaultImage?.altText ?? 'Placeholder'}
                            fill
                            placeholder={defaultImage?.blurDataUrl ? "blur" : undefined}
                            blurDataURL={defaultImage?.blurDataUrl ? defaultImage.blurDataUrl : undefined}
                            loader={imageLoader}
                            className="object-contain"
                        />
                    </div>,
                    document.body
                )
            }
        </>
    )
}