
interface SubHeadingProps {
    name: string;
    description: string;
    children?: React.ReactNode;
}

export function SubHeading({ name, description, children }: SubHeadingProps) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-baseline space-x-8">
                <h1 className="text-2xl font-bold">{name}</h1>
                <span className="text-zinc-400 text-sm">{description}</span>
            </div>
            {children}
        </div>
    );
}