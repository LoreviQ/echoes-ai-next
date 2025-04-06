export function SubHeading({ name, description }: { name: string, description: string }) {
    return (
        <div className="flex items-baseline space-x-8">
            <h1 className="text-2xl font-bold">{name}</h1>
            <span className="text-zinc-400 text-sm">{description}</span>
        </div>
    );
}