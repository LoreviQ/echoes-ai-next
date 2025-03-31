"use client";

import Image from 'next/image';
import { useState, useRef } from 'react';

interface UploadImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    priority?: boolean;
}

export default function UploadImage({ src, alt, fill, className, priority }: UploadImageProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className="cursor-pointer"
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Image
                src={src}
                alt={alt}
                fill={fill}
                className={className}
                priority={priority}
            />
            {isHovered && (
                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center ${className}`}>
                    <span className="text-white text-center px-2 break-words w-full">
                        Click to upload image
                    </span>
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                    // Will implement upload handling in next stage
                }}
            />
        </div>
    );
} 