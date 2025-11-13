'use client'

import { ProductImage } from "@/lib/products/product.types";
import Image from "next/image";
import UploadProductImageModal from "@/components/product/UploadProductImageModal";
import {imageLoader} from "@/lib/utils/util.image";

interface Props {
    images: ProductImage[];
    productId: string;
}

export default function ProductImageGrid({ images, productId }: Props) {
    const defaultImage = images.find(img => img.isDefault) ?? images[0];

    return (
        <div id="image-grid" className="">
            {/* Default Image */}
            <div className="relative w-full aspect-square border-2 border-brand-primary rounded-lg overflow-hidden bg-white">
                <Image
                    loader={imageLoader}
                    src={defaultImage?.imageUrl ?? '/images/product-placeholder.svg'}
                    alt={defaultImage?.altText ?? 'Placeholder'}
                    fill
                    blurDataURL={defaultImage?.blurDataUrl ? defaultImage.blurDataUrl : undefined}
                    placeholder={defaultImage?.blurDataUrl ? 'blur' : undefined}
                    className="object-contain p-2"
                />
                <UploadProductImageModal
                    productId={productId}
                    image={defaultImage}
                />
            </div>

            {/* Bottom Thumbnails */}

                <div id="bottom-images" className="flex gap-2 overflow-x-auto">
                    {images
                        .filter(img => !img.isDefault)
                        .map(img => (
                            <div key={img.id} className="relative w-24 aspect-square border border-brand-primary rounded-lg flex-shrink-0 overflow-hidden bg-white">
                                <Image
                                    loader={imageLoader}
                                    src={img.imageUrl}
                                    alt={img.altText}
                                    fill
                                    blurDataURL={img.blurDataUrl ? defaultImage.blurDataUrl : undefined}
                                    placeholder={img.blurDataUrl ? 'blur' : undefined}
                                    className="object-contain p-1"
                                />
                                <UploadProductImageModal
                                    productId={productId}
                                    image={img}
                                />
                            </div>
                        ))}
                    <div id="edit-images" className="flex items-center justify-center w-24 aspect-square border border-dashed border-gray-400 rounded-lg flex-shrink-0">
                        <UploadProductImageModal
                            productId={productId}
                        />
                    </div>
                </div>

        </div>
    );
}