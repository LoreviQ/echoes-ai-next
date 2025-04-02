import { BackButton } from '@/components/buttons/BackButton';

interface BackHeaderProps {
    text: string;
}

export function BackHeader({ text }: BackHeaderProps) {
    return (
        <div className="sticky top-0 left-0 right-0 h-[53px] bg-black/60 backdrop-blur-md text-white z-10 flex items-center px-4">
            <BackButton />
            <h2 className="font-bold text-2xl ml-3">{text}</h2>
        </div>
    );
} 