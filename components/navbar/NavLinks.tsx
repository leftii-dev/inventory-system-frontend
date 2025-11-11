'use client';
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NavLinks() {
    const { data: session } = useSession();
    const links = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        ...(session ? [{ href: "/profile", label: "My Profile" }, { href: "/dashboard", label: "Dashboard" }] : []),
    ]
    const currentPath = usePathname();

    return (
        <div className="flex flex-col p-4 grow
                        md:shadow-none md:flex-row md:justify-between md:ml-4 md:gap-x-10 md:items-center">
                <ul className={`flex flex-col gap-y-1 mb-2 font-inter divide-y divide-brand-primary md:mb-0 md:divide-y-0 md:flex-row md:items-center md:gap-x-4 md:px-2`}>
                    {links.map((link) => (
                        <li key={link.href} className={`flex px-4 md:px-0`}>
                            <Link href={link.href} className={`flex w-full h-12 justify-end items-center text-lg whitespace-nowrap
                            md:px-3 md:pt-2 md:items-start
                            ${currentPath === link.href ?
                                    `font-bold`
                                :
                                    `md:relative md:hover:opacity-75 md:transition-colors md:duration-300 md:after:content-['']
                                     md:after:absolute md:after:left-0 md:after:bottom-3 md:after:w-0 md:after:h-[2px] md:after:bg-brand-primary
                                     md:after:transition-all md:after:duration-300 md:hover:after:w-full`}`}>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <AuthButton />
        </div>
    );
}