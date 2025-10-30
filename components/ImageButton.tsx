import Image from "next/image";

export default function ImageButton({src, alt, width, height}: {src: string, alt: string, width?: number, height?: number, onClick?: () => void}) {
    return (
        <div className={`p-2 rounded-xl shadow-md bg-white transition-all duration-200 ease-in-out hover:bg-gray-100 hover:cursor-pointer border `}>
            <Image src={src} alt={alt} width={width || 1} height={height || 1}/>
        </div>
    )
}