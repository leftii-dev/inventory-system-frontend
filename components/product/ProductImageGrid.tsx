'use client'

import { ProductImage } from "@/lib/products/product.types";
import Image from "next/image";
import UploadProductImageModal from "@/components/product/UploadProductImageModal";
import { imageLoader } from "@/lib/utils/util.image";
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    images: ProductImage[];
    productId: string;
}

export default function ProductImageGrid({ images, productId }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ProductImage | undefined>(
        images.find(img => img.isDefault) ?? images[0]
    );

    const checkScrollability = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    };

    useEffect(() => {
        checkScrollability();
        const element = scrollRef.current;
        if (element) {
            element.addEventListener('scroll', checkScrollability);
            window.addEventListener('resize', checkScrollability);
            return () => {
                element.removeEventListener('scroll', checkScrollability);
                window.removeEventListener('resize', checkScrollability);
            };
        }
    }, [images]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 224;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    const handleImageClick = (image: ProductImage) => {
        setSelectedImage(image);
    };

    return (
        <div id="image-grid" className="space-y-4">
            {/* Main Selected Image */}
            <div className="relative w-full aspect-square border-2 border-brand-primary rounded-lg overflow-hidden bg-white shadow-sm">
                <Image
                    loader={imageLoader}
                    src={selectedImage?.imageUrl ?? '/images/product-placeholder.svg'}
                    alt={selectedImage?.altText ?? 'Placeholder'}
                    fill
                    blurDataURL={selectedImage?.blurDataUrl ? selectedImage.blurDataUrl : undefined}
                    placeholder={selectedImage?.blurDataUrl ? 'blur' : undefined}
                    className="object-contain p-2"
                />
                {selectedImage.isDefault && (
                    <div className="absolute top-1 right-1 bg-brand-primary text-white text-xs px-1.5 py-0.5 rounded-md font-medium shadow-sm">
                        Default
                    </div>
                )}
                <UploadProductImageModal
                    productId={productId}
                    image={selectedImage}
                />
            </div>

            {/* Bottom Thumbnails with Scroll Controls */}
            <div className="relative group">
                {/* Left Scroll Button */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5 text-brand-primary" />
                    </button>
                )}

                {/* Right Scroll Button */}
                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5 text-brand-primary" />
                    </button>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollRef}
                    id="bottom-images"
                    className="flex gap-2 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth scrollbar-hide"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {images.map(img => (
                        <button
                            key={img.id}
                            onClick={() => handleImageClick(img)}
                            className={`relative w-24 aspect-square border rounded-lg flex-shrink-0 overflow-hidden bg-white snap-start transition-all duration-200 ${
                                selectedImage?.id === img.id
                                    ? 'border-2 border-brand-primary ring-2 ring-brand-primary/30 shadow-md'
                                    : 'border border-gray-300 hover:border-brand-primary hover:shadow-md'
                            }
                            ${img.isDefault ? 'cursor-default border-t-4 border-brand-secondary' : 'cursor-pointer'}`}
                            aria-label={`Select ${img.altText}`}
                        >
                            <Image
                                loader={imageLoader}
                                src={img.imageUrl}
                                alt={img.altText}
                                fill
                                blurDataURL={img.blurDataUrl ? img.blurDataUrl : undefined}
                                placeholder={img.blurDataUrl ? 'blur' : undefined}
                                className={`object-contain p-1`}
                            />
                        </button>
                    ))}

                    {/* Add Image Button */}
                    <div
                        id="edit-images"
                        className="flex items-center justify-center w-24 aspect-square border-2 border-dashed border-gray-300 rounded-lg flex-shrink-0 snap-start hover:border-brand-primary hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    >
                        <UploadProductImageModal
                            productId={productId}
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}