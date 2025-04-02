import { SupabaseCellReference } from "@/types/supabase";
import PreviewImage from "./PreviewImage";
import UploadImage from "./UploadImage";


/**
 * DynamicImage component
 * 
 * This component is used to display an image from a given source.
 * Depending on state, will display a preview image or an upload image.
 */
interface DynamicImageProps {
    src: string | null;
    placeholderSrc: string;
    alt: string;
    upload?: boolean;
    bucketName?: string;
    cellReference?: SupabaseCellReference;
    className?: string;
}

export function DynamicImage({ src, placeholderSrc, alt, bucketName, cellReference, className, upload = false }: DynamicImageProps) {
    if (!src) {
        src = placeholderSrc;
    }

    if (!upload) {
        return (
            <PreviewImage
                src={src}
                alt={alt}
                fill
                className={className}
                priority
            />
        );
    }
    if (bucketName && cellReference) {
        return (
            <UploadImage
                src={src}
                alt={alt}
                fill
                className={className}
                priority
                bucketName={bucketName}
                reference={cellReference}
            />
        );
    }
    // Set to upload, but required info for upload is missing
    return null;
}