export default function FormCard({ children, onSubmit }: {children: React.ReactNode, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void}) {
    return (
        <form onSubmit={onSubmit} className={`w-full max-w-lg bg-white p-8 rounded-lg shadow-md border border-gray-300`}>
            {children}
        </form>
    )
}