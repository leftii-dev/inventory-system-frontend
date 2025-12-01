import {CirclePlus} from "lucide-react"
import Link from 'next/link'

type Props = {
    href: string
}
export default function AddButton({href}: Props) {
    return (
        <div className={'absolute bottom-4 right-4 z-50'}>
            <Link
                href={href}
                className={`flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary
                            shadow-lg transition-transform hover:scale-105 hover:bg-opacity-90`}
            >
                <CirclePlus className={'h-8 w-8 text-white'}/>
            </Link>
        </div>
    )
}