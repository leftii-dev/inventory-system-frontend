import {getProducts} from "@/lib/products/product.actions";
import ProductCard from "@/components/product/ProductCard";

export default async function ProductsPage() {
    const res = await getProducts();

    if(!res.ok) return;

    const products = res.response
    return (
        <div className={`flex flex-col justify-items-center px-20`}>
            <h1 className={`grow font-mono text-xl pb-6`}>Products</h1>
            <div className={`grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}>
                {products &&
                    products.data.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                }
            </div>
        </div>
    )
}