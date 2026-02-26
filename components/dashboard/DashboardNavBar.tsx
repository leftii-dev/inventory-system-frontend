'use client';

import { useSession } from "@/lib/hooks/useSession";
import DashboardNavLinks from "@/components/dashboard/DashboardNavLinks";

export default function DashboardNavBar() {
    const { user } = useSession();

    return (
        <nav className={'flex flex-col min-w-2/12 rounded-l-lg whitespace-nowrap bg-brand-primary'} aria-label="Dashboard">
            <div className={'flex flex-col gap-5'}>
                <p className={'p-3 text-center '}>Welcome
                    {user?.name ?
                        <>
                            ,<span className={'font-inter font-medium'}> {user?.name}</span>
                        </> : null
                    }!</p>
                <DashboardNavLinks />
            </div>
        </nav>
    )
}