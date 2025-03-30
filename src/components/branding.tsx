import Link from "next/link";

export function TypefaceOutlined({ text, path, outlineColour, collapsed = false }: { text: string, path: string, outlineColour: string, collapsed?: boolean }) {
    return (
        <Link
            href={path}
            className={`${collapsed ? 'text-3xl' : 'text-5xl'} font-custom flex items-center justify-center`}
            style={{
                WebkitTextStroke: `2px ${outlineColour}`,
                color: 'transparent'
            }}
        >
            {text}
        </Link>
    );
}