import { BackButton } from '@/components/buttons';

interface BackHeaderProps {
    text: string;
    children?: React.ReactNode;
}

export function BackHeader({ text, children }: BackHeaderProps) {
    return (
        <div className="sticky top-0 left-0 right-0 h-[53px] bg-black/60 backdrop-blur-md text-white z-10 flex items-center justify-between px-4">
            <div className="flex items-center">
                <BackButton />
                <h2 className="font-bold text-2xl ml-3">{text}</h2>
            </div>
            {children && (
                <div className="flex items-center">
                    {children}
                </div>
            )}
        </div>
    );
} 