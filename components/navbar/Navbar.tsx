'use client';
import NavLinks from "./NavLinks";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if(!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if(menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen])

    return (
        <nav className="flex flex-col justify-between md:px-16 md:flex-row md:justify-between md:items-center shadow p-4 md:mb-4">
            <div className={`relative flex w-full justify-center items-center p-4 md:p-0 md:justify-start`}>
                <div className={``}>
                    <Logo />
                </div>
                <button
                    onClick={toggleMenu}
                    className="absolute bottom-4 right-4 md:hidden"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    {isOpen ? <X size={36}/> : <Menu size={36} />}
                </button>
            </div>
            <div
                ref={menuRef}
                className={`flex flex-col gap-y-4 md:flex-none`}>

                <div className={`transition-[max-height] duration-400 outline outline-gray-300 shadow rounded-2xl ease-in-out overflow-hidden 
                ${isOpen ? 'max-h-screen' : 'max-h-0'} md:outline-none md:shadow-none md:flex md:max-h-max`} id="navbarNav">
                    <NavLinks />
                </div>
            </div>
        </nav>
    )
}