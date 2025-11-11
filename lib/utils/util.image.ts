export const imageLoader = (
    {
        src,
        width,
        quality
    }:
    {
        src: string,
        width: number,
        quality?: number
    }) => {
    return `${src}?w=${width}${quality ? `&q=${quality}` : ''}`;
}