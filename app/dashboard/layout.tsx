import {getSession} from "@/lib/auth/session";
import {redirect} from "next/navigation";
import DashboardNavBar from "@/components/dashboard/DashboardNavBar";
import SessionGuard from "@/components/dashboard/SessionGuard";

export default async function DashboardLayout(
    {
        children
    }:{
        children: React.ReactNode
    }) {
    const user = await getSession();
    if(!user){
        redirect('/auth/login?callbackUrl=/dashboard&reason=no-session');
    }
    if(!user.roles?.some(role => ['EMPLOYEE', 'ADMIN','MANAGER'].includes(role))){
        throw new Error('Unauthorized access to dashboard - insufficient permissions');
    }
    return (
        <div className={'flex flex-row divide-x divide-gray-100 shadow rounded-lg'}>
            <SessionGuard />
            <DashboardNavBar />
            <div className={'w-full rounded-r-lg max-w-10/12'}>
                {children}
            </div>
        </div>
    )
}