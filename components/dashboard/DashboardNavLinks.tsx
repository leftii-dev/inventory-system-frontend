import Link from "next/link";
import {usePathname} from "next/navigation";
import {ArrowRightLeft, Box, Boxes, LayoutDashboard, LayoutList, NotebookTabs} from "lucide-react";

export default function DashboardNavLinks() {
    const currentUrl = usePathname();

    const links = [
        {label: 'Dashboard', url: '/dashboard', Icon: LayoutDashboard},
        {label: 'Product List', url: '/dashboard/products', Icon: Box},
        {label: 'Purchasing', url: '/dashboard/purchasing', Icon: LayoutList},
        {label: 'Receiving', url: '/dashboard/receiving', Icon: Boxes},
        {label: 'Transfers', url: '/dashboard/transfers', Icon: ArrowRightLeft},
        {label: 'Vendor List', url: '/dashboard/vendors', Icon: NotebookTabs},
    ]
    return (
        <ul className={'flex flex-col justify-center w-full'}>
            {links.map((link) => {
                const isActive = currentUrl === link.url;
                return(
                    <li
                        key={`link-${link.label}`}
                        className={`${isActive ? 'bg-brand-primary/75 relative z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.35)]' : ''}`}
                    >
                        <Link className={'flex flex-row justify-between p-5 transition-transform duration-200 ease-in-out hover:scale-95'} href={link.url}>
                            <span>{link.label}</span>
                            <link.Icon strokeWidth={isActive ? 2.25 : 1.5} />
                        </Link>
                    </li>
                )}
            )}
        </ul>
    )
}