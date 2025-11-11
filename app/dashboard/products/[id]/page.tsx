import {getProduct} from "@/lib/products/product.actions";
import ProductImageGrid from "@/components/product/ProductImageGrid";

export default async function DashboardProductDetailPage({params}: {params: {id: string}}) {
    const { id } = await params
    const res = await getProduct(id);

    if(!res.ok) return null;

    const product = res.response.data
    return (
        <div className={`flex flex-row grow w-full border border-gray-300 rounded-lg shadow-lg`}>
            <div className={`flex flex-col w-1/4 mr-auto p-4`}>
                <ProductImageGrid images={product.images} productId={product.id}/>
            </div>
        </div>
    )
}