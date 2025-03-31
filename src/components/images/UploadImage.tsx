"use client";

import Image from 'next/image';
import { useState, useRef } from 'react';
import { createClient } from '@/utils/supabase.client';
import type { SupabaseCellReference } from '@/types/supabase';

interface UploadImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    priority?: boolean;
    bucketName: string;
    reference: SupabaseCellReference;
    onUploadComplete?: (url: string) => void;
}

export default function UploadImage({
    src,
    alt,
    fill,
    className,
    priority,
    bucketName,
    reference,
    onUploadComplete
}: UploadImageProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const supabase = createClient();

            // Upload file to storage
            const fileExt = file.name.split('.').pop();
            const filePath = `${reference.id}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from(bucketName)
                .upload(filePath, file, {
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from(bucketName)
                .getPublicUrl(filePath);

            // Update database reference
            console.log(reference);
            const { error: updateError } = await supabase
                .from(reference.tableName)
                .update({ [reference.columnName]: publicUrl })
                .eq('id', reference.id);

            if (updateError) throw updateError;

            // Notify parent component
            onUploadComplete?.(publicUrl);

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file. Please try again.');
        } finally {
            setIsUploading(false);
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
                src={src}
                alt={alt}
                fill={fill}
                className={`${className}`}
                priority={priority}
            />
            {isHovered && (
                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center ${className}`}>
                    <span className="text-white text-center px-2 break-words w-full">
                        {isUploading ? 'Uploading...' : 'Click to upload image'}
                    </span>
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
            />
        </div>
    );
} 