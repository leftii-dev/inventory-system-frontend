'use server';

import {
    BrandResponse,
    CategoryResponse,
    DiscountResponse,
    ProductImage,
    ProductResponse
} from "@/lib/products/product.types";
import { ActionResult, apiAction } from "@/lib/utils/api.actions";
import { toQueryString } from "@/lib/utils/util.params";
import { ProductImageRequestSchema } from "@/lib/products/product.schemas";
import { emptyApiResponse } from "@/lib/types/validation.types";
import { join } from 'path'
import {unlink} from "node:fs/promises";
import sharp from "sharp";

export async function getProducts(
    searchParams?: Record<string, string | string[] | undefined>
): Promise<ActionResult<ProductResponse[]>> {
    const endpoint = `/products${searchParams ? toQueryString(searchParams) : ''}`
    const res = await apiAction<ProductResponse[]>({
        endpoint: endpoint,
    });
    console.log(endpoint)
    console.log(res.response);
    return res;
}

export async function getProduct(
    id: string
): Promise<ActionResult<ProductResponse>> {
    return apiAction<ProductResponse>({
        endpoint: `/products/${id}`
    })
}

export async function getCategories(): Promise<ActionResult<CategoryResponse[]>> {
    return await apiAction<CategoryResponse[]>({
        endpoint: `/categories`,
    });
}

export async function getBrands(): Promise<ActionResult<BrandResponse[]>> {
    return await apiAction<BrandResponse[]>({
        endpoint: `/brands`
    });
}

export async function getDiscounts(): Promise<ActionResult<DiscountResponse[]>> {
    return await apiAction<DiscountResponse[]>({
        endpoint: `/discounts`,
    })
}


export async function addProductImage(
    prevState: ActionResult<ProductImage>,
    formData: FormData
): Promise<ActionResult<ProductImage>> {
    try {
        const productId = formData.get("productId") as string;
        const file = formData.get("imageUrl") as File | null;
        const originalUrl = formData.get("originalUrl") as string;
        const productImageId = formData.get("productImageId") as string;

        formData.delete("productId");
        formData.delete("originalUrl");
        formData.delete("productImageId");
        if (!productId) {
            return {
                ok: false,
                response: emptyApiResponse<ProductImage>(),
                errors: { general: "Missing product ID" },
            };
        }

        let imageUrl: string | undefined;
        if (file && file.size > 0) {
            const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
            const MAX_SIZE = 5 * 1024 * 1024;

            if (!ACCEPTED_TYPES.includes(file.type)) {
                return {
                    ok: false,
                    response: emptyApiResponse<ProductImage>(),
                    errors: { imageUrl: "File must be a JPEG, PNG, or WebP image" },
                };
            }

            if (file.size > MAX_SIZE) {
                return {
                    ok: false,
                    response: emptyApiResponse<ProductImage>(),
                    errors: { imageUrl: "File size must be less than 5MB" },
                };
            }

            const uploadForm = new FormData();
            uploadForm.append("file", file);
            const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/uploads`, {
                method: "POST",
                body: uploadForm,
            });

            const uploadData = await uploadRes.json();

            if (!uploadData?.success || !uploadData?.data?.imageUrl) {
                return {
                    ok: false,
                    response: emptyApiResponse<ProductImage>(),
                    errors: { general: "Missing image" },
                }
            }

            imageUrl = uploadData.data.imageUrl;
            if(imageUrl){
                formData.set('imageUrl', imageUrl);

                const imageBuffer = Buffer.from(await file.arrayBuffer());

                const ext = file.type.split('/')[1] || 'jpeg';
                let blurBuffer: Buffer;

                if(ext === 'png') {
                    blurBuffer = await sharp(imageBuffer)
                        .resize(10, null, { fit: 'inside' })
                        .blur()
                        .png({ compressionLevel: 6 })
                        .toBuffer();
                } else if(ext === 'webp') {
                    blurBuffer = await sharp(imageBuffer)
                        .resize(10, null, { fit: 'inside' })
                        .blur()
                        .webp({ quality: 50 })
                        .toBuffer();
                } else {
                    blurBuffer = await sharp(imageBuffer)
                        .resize(10, null, { fit: 'inside' })
                        .blur()
                        .jpeg({ quality: 50 })
                        .toBuffer();
                }

                const blurBase64 = `data:${file.type};base64,${blurBuffer.toString('base64')}`;
                formData.set('blurDataUrl', blurBase64);

            }



            let response;
            if (originalUrl && productImageId) {
                response = await apiAction<ProductImage>(
                    {
                        schema: ProductImageRequestSchema,
                        endpoint: `/products/${productId}/images/${productImageId}`,
                        method: "PUT",
                        numberFields: ["displayOrder"],
                        booleanFields: ["isDefault"],
                        requireAuth: true,
                    },
                    formData
                );

                // Delete old file if backend update succeeded
                if (response.ok) {
                    try {
                        const oldFilePath = join(process.cwd(), "uploads", originalUrl.replace("/uploads/", ""));
                        await unlink(oldFilePath);
                        console.log("Deleted old file:", oldFilePath);
                    } catch (deleteErr) {
                        console.warn("Could not delete old file:", deleteErr);
                    }
                }
            } else {
                response = await apiAction<ProductImage>(
                    {
                        schema: ProductImageRequestSchema,
                        endpoint: `/products/${productId}/images`,
                        method: "POST",
                        numberFields: ["displayOrder"],
                        booleanFields: ["isDefault"],
                        requireAuth: true,
                    },
                    formData
                );
            }

            return response;
        }

        return {
            ok: false,
            response: emptyApiResponse<ProductImage>(),
            errors: { general: "File not found" },
        };
    } catch (err) {
        console.error("addProductImage failed.", err);
        const message = err instanceof Error ? err.message : "Unexpected Error";
        return {
            ok: false,
            response: emptyApiResponse<ProductImage>(),
            errors: { general: message },
        };
    }
}

export async function deleteProductImage(
    prevState: ActionResult<unknown>,
    formData: FormData
): Promise<ActionResult<unknown>> {
    return await apiAction<unknown>({
        endpoint: `/products/${formData.get("productId")}/images/${formData.get('productImageId')}`,
        method: 'DELETE',
        requireAuth: true,
    }, formData);
}

