type Props = {
    children: React.ReactNode;
    hideSmall?: boolean;
    title?: string;
    className?: string;
}

export default function PurchasingItemCell({children, hideSmall, title, className}: Props) {
    const tooltipText = title ||
        (typeof children === 'string' || typeof children === 'number')
            ? String(children)
            : undefined;
    return (
        <td className={`${hideSmall ? 'hidden sm:table-cell' : ''} ${className || ''}`}>
            <div className={'truncate w-full'} title={tooltipText}>
                {children}
            </div>
        </td>
    )
}