import Link from "next/link";

export default async function DashboardPage() {
    return (
        <>
            <h1>Welcome back!</h1>
            <Link href={'/dashboard/products'}>Product List</Link>
        </>
    )
}
