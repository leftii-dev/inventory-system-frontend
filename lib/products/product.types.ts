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
    images: string[];
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