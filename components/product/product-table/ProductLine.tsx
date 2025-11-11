'use client'

import {ProductResponse} from "@/lib/products/product.types";
import Image from "next/image";
import ProductCell from "@/components/product/product-table/ProductCell";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {createPortal} from "react-dom";


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
                className={`text-center whitespace-nowrap overflow-hidden max-h-5 hover:border hover:border-brand-primary odd:bg-gray-100 hover:cursor-pointer`}
                onClick={triggerNavigation}
            >
                    <ProductCell>{product.sku}</ProductCell>
                    <ProductCell>{product.brandName}</ProductCell>
                    <ProductCell>{product.name}</ProductCell>
                    <ProductCell>{product.description}</ProductCell>
                    <ProductCell>{product.productCode}</ProductCell>
                    <ProductCell>{product.categoryName}</ProductCell>
                    <ProductCell>${product.price}</ProductCell>
                    <ProductCell>{product.discountName}</ProductCell>

                <ProductCell>
                    <div className={`relative w-full h-6`}>
                        <Image
                            src={defaultImage?.imageUrl ?? `/images/product-placeholder.svg`}
                            alt={defaultImage?.altText ?? `Placeholder for missing product image`}
                            fill
                            unoptimized
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
                            width={500}
                            height={500}
                            className="object-contain"
                        />
                    </div>,
                    document.body
                )
            }
        </>
    )
}