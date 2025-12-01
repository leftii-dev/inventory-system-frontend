type Props = {
    children: React.ReactNode;
    hideSmall?: boolean;
    title?: string;
}

export default function ProductCell({children, hideSmall, title}: Props) {
    const tooltipText = title ||
        (typeof children === 'string' || typeof children === 'number')
        ? String(children)
        : undefined;
    return (
        <td className={`${hideSmall ? 'hidden md:block' : ''} px-2`}>
            <div className={'truncate w-full'} title={tooltipText}>
                {children}
            </div>
        </td>
    )
}