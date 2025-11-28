import {BigDecimalLike} from "@/lib/types/validation.types";

export type ProductResponse = ProductBasic | ProductDetail;

interface ProductBasic {
    id: string;
    sku: string;
    productCode: string;
    name: string;
    description: string;
    price:  BigDecimalLike;
    weight: BigDecimalLike;
    dimensions: Record<string, unknown>;
    additionalDetails: Record<string, unknown>;
    categoryID: string;
    categoryName: string;
    images: ProductImageResponse[];
    brandID: string;
    brandName: string;
    discountID: string;
    discountName: string;
}

interface ProductDetail extends ProductBasic {
    cost: BigDecimalLike;
    createdAt: string;
    modifiedAt: string;
    createdBy: string;
    modifiedBy: string;
    active: boolean;
}

export type ProductImageResponse = ProductImageBasic | ProductImageDetail;

interface ProductImageBasic {
    id: string;
    productId: string;
    imageUrl: string;
    displayOrder: string;
    isDefault: boolean;
    altText: string;
    imageType: string;
    blurDataUrl: string;
}

interface ProductImageDetail extends ProductImageBasic {
    createdAt: string;
    modifiedAt: string;
    createdBy: string;
    modifiedBy: string;
    active: boolean;
}

export type ProductFilters = {
    skuContains?: string;
    codeContains?: string;
    query?: string;
    costEqual?: string;
    costBelow?: string;
    costAbove?: string;
    priceEqual?: string;
    priceBelow?: string;
    priceAbove?: string;
    category?: string;
    discount?: string;
    brand?: string;
}

export type CategoryResponse = CategoryBasic | CategoryDetail;

interface CategoryBasic {
    id: string;
    categoryCode: string;
    name: string;
    description: string;
    discountID: string;
}

interface CategoryDetail extends CategoryBasic {
    createdBy: string;
    createdAt: string;
    modifiedBy: string;
    modifiedAt: string;
    active: boolean;
}

export type BrandResponse = BrandBasic | BrandDetail;

interface BrandBasic {
    id: string;
    name: string;
    description: string;
}

interface BrandDetail extends BrandBasic {
    createdAt: string;
    modifiedAt: string;
    createdBy: string;
    modifiedBy: string;
    active: boolean;
}

export type DiscountResponse = DiscountBasic | DiscountDetail;

interface DiscountBasic {
    id: string;
    discountCode: string;
    name: string;
    description: string;
    discountPercentage: BigDecimalLike;
}

interface DiscountDetail extends DiscountBasic {
    createdBy: string;
    createdAt: string;
    modifiedBy: string;
    modifiedAt: string;
    active: boolean;
}

export type CategoryHierarchyResponse = CategoryHierarchyResponseBasic | CategoryHierarchyResponseDetail;

interface CategoryHierarchyResponseBasic {
    id: string;
    categoryID: string;
    parentCategoryID: string;
}

interface CategoryHierarchyResponseDetail extends CategoryHierarchyResponseBasic {
    createdAt: string;
    createdBy: string;
    modifiedAt: string;
    modifiedBy: string;
    active: boolean;
}