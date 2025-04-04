import Link from "next/link";

export function TypefaceOutlined({ text, outlineColour, className, onClick }: {
    text: string,
    outlineColour: string,
    className?: string,
    onClick?: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={`${className} flex items-center justify-center cursor-pointer`}
            style={{
                WebkitTextStroke: `2px ${outlineColour}`,
                color: 'transparent',
                fontFamily: 'var(--font-cyberway), sans-serif'
            }}
        >
            {text}
        </button>
    );
}