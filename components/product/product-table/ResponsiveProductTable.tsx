'use client'

import { useEffect, useState } from 'react'
import ProductTable from './ProductTable'
import ProductTableMobile from './ProductTableMobile'
import { BrandResponse, CategoryResponse, DiscountResponse, ProductResponse } from "@/lib/products/product.types"

type Props = {
    initialProducts: ProductResponse[]
    categories: CategoryResponse[]
    brands: BrandResponse[]
    discounts: DiscountResponse[]
}

export default function ResponsiveProductTable(props: Props) {
    const [isMobile, setIsMobile] = useState(false)

    // Debounced resize handler (so it doesn’t thrash on window resize)
    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768)
        checkScreen()
        window.addEventListener('resize', checkScreen)
        return () => window.removeEventListener('resize', checkScreen)
    }, [])

    // Conditionally render one or the other
    return isMobile
        ? <ProductTableMobile {...props} />
        : <ProductTable {...props} />
}
