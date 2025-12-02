import {BigDecimalLike} from "@/lib/types/validation.types";

export type PurchaseOrderResponse = PurchaseOrderResponseBasic | PurchaseOrderResponseDetail;

interface PurchaseOrderResponseBasic {
    id: string;
    dateExpected: string;
    purchaseOrderCode: string;
    totalCost: BigDecimalLike;
    notes: string;
    vendor: VendorResponse;
    status: StatusResponse;
}

interface PurchaseOrderResponseDetail extends PurchaseOrderResponseBasic {
    createdAt: string;
    createdByID: string;
    modifiedAt: string;
    modifiedByID: string
    active: boolean
}

export type VendorResponse = VendorResponseBasic | VendorResponseDetail;

interface VendorResponseBasic {
    id: string;
    vendorCode: string;
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    contactName: string;
    phone: string;
    email: string;
}

interface VendorResponseDetail extends VendorResponseBasic {
    isActive: boolean;
    createdAt: string;
    modifiedAt: string;
    createdByID: string;
    modifiedBy: string;
    active: boolean;
}

export type StatusResponse = StatusResponseBasic | StatusResponseDetail;

interface StatusResponseBasic {
    id: string;
    name: string;
    description: string;
}

interface StatusResponseDetail extends StatusResponseBasic {
    createdAt: string;
    modifiedAt: string;
    createdByID: string;
    modifiedByID: string;
    active: boolean;
}