import Link from "next/link";

export function TypefaceOutlined({ text, path, outlineColour, className }: { text: string, path: string, outlineColour: string, className?: string }) {
    return (
        <Link
            href={path}
            className={`${className} flex items-center justify-center`}
            style={{
                WebkitTextStroke: `2px ${outlineColour}`,
                color: 'transparent',
                fontFamily: 'var(--font-cyberway), sans-serif'
            }}
        >
            {text}
        </Link>
    );
}