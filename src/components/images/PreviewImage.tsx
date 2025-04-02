'use client';

import Image from 'next/image';
import { useImagePreview } from '@/contexts/imagePreview';

interface PreviewImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    priority?: boolean;
}

export default function PreviewImage({ src, alt, fill, className, priority }: PreviewImageProps) {
    const { openPreview } = useImagePreview();

    return (
        <div
            className="cursor-pointer"
            onClick={(e) => {
                e.preventDefault();
                openPreview(src);
            }}
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