import {getBrands, getCategories, getDiscounts, getProduct} from "@/lib/products/product.actions";
import ProductImageGrid from "@/components/product/ProductImageGrid";
import ProductEditForm from "@/app/dashboard/products/[id]/ProductEditForm";
import {emptyApiResponse} from "@/lib/types/validation.types";
import {ProductResponse} from "@/lib/products/product.types";

export default async function DashboardProductDetailPage({params}: {params: {id: string}}) {
    const { id } = await params
    const isNew = id === 'new';

    const [categories, brands, discounts, productResponse] = await Promise.all([
        getCategories(),
        getBrands(),
        getDiscounts(),
        isNew ? Promise.resolve(null) : getProduct(id)
    ]);

    if(!isNew && (!productResponse || !productResponse.ok)){
        return <div>Product not found</div>
    }

    const newProduct: ProductResponse  = {
        id: '',
        sku: '',
        productCode: '',
        name: '',
        description: '',
        cost: 0,
        price: 0,
        weight: 0,
        dimensions: {},
        additionalDetails: {},
        categoryID: '',
        categoryName: '',
        images: [],
        brandID: '',
        brandName: '',
        discountID: '',
        discountName: '',
    }

    const formInitialData = isNew
        ? emptyApiResponse<ProductResponse>(newProduct)
        : productResponse!.response;

    const product = !isNew ? productResponse!.response.data : null;
    return (
        <div className={`flex flex-row grow w-full border border-gray-300 rounded-lg shadow-lg`}>
            {!isNew && (
                <div className={`flex flex-col w-1/4 p-4 border-r border-gray-300`}>
                    <ProductImageGrid images={product ? product.images : []} productId={product ? product.id : ''}/>
                </div>
                )
            }
            <div className={`flex flex-col flex-1 p-4`}>
                <ProductEditForm
                    isNew={isNew}
                    initialProduct={formInitialData}
                    initialCategories={categories.response?.data || []}
                    initialBrands={brands.response?.data || []}
                    initialDiscounts={discounts.response?.data || []}
                />
            </div>
        </div>
    )
}