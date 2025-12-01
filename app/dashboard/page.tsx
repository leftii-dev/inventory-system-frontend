import Link from "next/link";

export default async function DashboardPage(
    {
        searchParams
    }:{
        searchParams: Promise<{error?: string}>
    }
){
    const { error } = await searchParams;
    return (
        <div className={'text-center'}>
            {error === 'unauthorized' ? (
                <>
                    <h1 className={'font-inter text-xl'}>Not Authorized</h1>
                    <p className={'text-xl font-mono'}>
                        You do not have permission to access the dashboard. If you believe this is an error, please contact your manager or administrator.
                    </p>
                </>
            )
            : (
                <>
                <h1>Welcome back!</h1>
                <Link href={'/dashboard/products'}>Product List</Link>
                </>
            )}
        </div>
    )
}
