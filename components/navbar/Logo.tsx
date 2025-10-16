import Link from "next/link";
import Image from "next/image";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="hidden md:flex items-center gap-2">
                <Image
                    src={`/images/logo_text.svg`}
                    alt={`Site Logo`}
                    width={148}
                    height={66}
                    className={`h-auto w-64`}
                    priority
                />
            </div>
            <div className="block md:hidden">
                <Image
                    src={`/images/logo.svg`}
                    alt={`Site Logo`}
                    width={53}
                    height={66}
                    className={`h-auto w-24`}
                    priority
                />
            </div>
        </Link>
    )
}