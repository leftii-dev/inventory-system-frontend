'use client';
import {ProductResponse} from "@/lib/products/product.types";
import Link from "next/link";

export default function ProductCard({product}: {product:ProductResponse}) {
    return(

            <article className="flex flex-col font-inter space-y-3 items-center border border-gray-300 rounded-lg shadow-lg shadow-brand-primary py-6 px-4 text-center">
                <Link href={`/brands/${product.brandID}`}>
                    <h2 className={`text-lg font-inter`}>{product.brandName}</h2>
                </Link>

                <Link href={`/products/${product.id}`} aria-label={`View ${product.name} details`}>
                    <div className="min-w-32 min-h-32 bg-brand-secondary">Image placeholder</div>
                    <h3 className="w-full whitespace-nowrap text-md">{product.name}</h3>
                    <p className="text-sm  font-mono text-gray-600 truncate w-full">{product.description}</p>
                    <p className="justify-end ml-auto">
                        <data value={product.price.valueOf()}>${product.price.valueOf()}</data>
                    </p>
                </Link>
            </article>


    )
}