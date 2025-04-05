'use client';

import Image from 'next/image';

import { useImagePreview } from '@/contexts';

interface PreviewImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    priority?: boolean;
    width?: number;
    height?: number;
}

export default function PreviewImage({ src, alt, fill, className, priority, width, height }: PreviewImageProps) {
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
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                className={className}
                priority={priority}
            />
        </div>
    );
} 