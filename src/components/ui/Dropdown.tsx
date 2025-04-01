interface DropdownProps {
    children: React.ReactNode;
    className?: string;
    align?: 'left' | 'right';
}

export function Dropdown({ children, className = '', align = 'right' }: DropdownProps) {
    return (
        <div className={`
            absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 
            bg-black border border-white rounded-xl p-2 
            text-white z-50
            ${className}
        `}>
            {children}
        </div>
    );
}

interface DropdownItemProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

export function DropdownItem({ onClick, children, className = '' }: DropdownItemProps) {
    return (
        <button
            onClick={onClick}
            className={`
                w-full px-4 py-2 text-left 
                hover:bg-zinc-900 rounded-lg transition-colors
                ${className}
            `}
        >
            {children}
        </button>
    );
} 