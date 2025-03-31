"use client";

import Image from 'next/image';
import { useImagePreview } from '@/contexts/imagePreview';

interface ClickableImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    priority?: boolean;
}

export default function ClickableImage({ src, alt, fill, className, priority }: ClickableImageProps) {
    const { openPreview } = useImagePreview();

    return (
        <div
            className="cursor-pointer"
            onClick={() => openPreview(src)}
        >
            <Image
                src={src}
                alt={alt}
                fill={fill}
                className={className}
                priority={priority}
            />
        </div>
    );
} 