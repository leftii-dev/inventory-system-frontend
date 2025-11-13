import {getSession} from "@/lib/auth/session";
import {redirect} from "next/navigation";

export default async function DashboardLayout(
    {
        children
    }:{
        children: React.ReactNode
    }) {
    const user = await getSession();
    if(!user){
        redirect('/auth/login?redirect=/dashboard&reason=no-session');
    }
    if(!user.roles?.some(role => ['EMPLOYEE', 'ADMIN','MANAGER'].includes(role))){
        throw new Error('Unauthorized access to dashboard - insufficient permissions');
    }
    return (
        <>
            {children}
        </>
    )
}