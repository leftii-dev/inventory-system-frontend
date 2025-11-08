export default function ProductCell({children, hideSmall}: {children: React.ReactNode, hideSmall?: boolean}) {
    return (
        <td className={`${hideSmall ? 'hidden md:block' : ''} px-2`}>
            {children}
        </td>
    )
}