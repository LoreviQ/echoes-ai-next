"use client";

import Image from 'next/image';
import { useState, useRef } from 'react';

interface SelectImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    priority?: boolean;
    onFileSelected?: (file: File) => void;
}

export default function SelectImage({
    src,
    alt,
    fill,
    className,
    priority,
    onFileSelected
}: SelectImageProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [previewSrc, setPreviewSrc] = useState(src);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a local preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewSrc(objectUrl);

        // Notify parent component
        if (onFileSelected) {
            onFileSelected(file);
        }
    };

    return (
        <div
            className="cursor-pointer"
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Image
                src={previewSrc}
                alt={alt}
                fill={fill}
                className={`${className}`}
                priority={priority}
            />
            {isHovered && (
                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center ${className}`}>
                    <span className="text-white text-center px-2 break-words w-full">
                        {'Click to select an image'}
                    </span>
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    );
} 