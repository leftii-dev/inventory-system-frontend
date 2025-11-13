import { ImageLoaderProps } from "next/image";

export const imageLoader = (
    {
        src,
        width,
        quality
    }:ImageLoaderProps) => {
    return `${src}?w=${width}${quality ? `&q=${quality}` : '&q=75'}`;
}