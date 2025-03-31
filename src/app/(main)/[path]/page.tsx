import { createClient } from '@/utils/supabase.client';
import { notFound } from 'next/navigation';
import PreviewImage from '@/components/images/PreviewImage';
import UploadImage from '@/components/images/UploadImage';
import { DocumentIcon, SettingsIcon, SearchIcon } from '@/assets/icons';
import { BackButton } from '@/components/buttons/BackButton';
import { Character } from '@/types/character';

export default async function CharacterPage(
    props: {
        params: Promise<{ path: string }>;
    }
) {
    const params = await props.params;
    const supabase = createClient();

    // Fetch character data
    const { data: character, error } = await supabase
        .from('characters')
        .select('*')
        .eq('path', params.path)
        .single() as { data: Character | null, error: any };

    if (error || !character) {
        notFound();
    }

    return (
        <main className="flex flex-col">
            <CharacterInfo character={character} />
        </main>
    );
}

function CharacterInfo({ character }: { character: Character }) {
    return (
        <>
            <div className="relative w-full max-w-[600px]">
                <div className="sticky top-0 left-0 right-0 h-[53px] bg-black/60 backdrop-blur-md text-white z-10 flex items-center px-4">
                    <BackButton />
                    <h2 className="font-bold text-2xl ml-3">{character.name}</h2>
                </div>
                <div className="relative w-full aspect-[3/1]">
                    <DynamicImage
                        src={character.banner_url}
                        placeholderSrc="/images/banner-placeholder.jpg"
                        alt="Character banner"
                        bucketName="character-banners"
                        reference={character.id}
                        className="object-contain"
                    />
                </div>
                <div className="absolute bottom-0 translate-y-1/2 left-4">
                    <div className="relative w-[150px] h-[150px] rounded-full border-4 border-black">
                        <DynamicImage
                            src={character.avatar_url}
                            placeholderSrc="/images/avatar-placeholder.jpg"
                            alt="Character avatar"
                            bucketName="character-avatars"
                            reference={character.id}
                            className="rounded-full object-cover"
                        />
                    </div>
                </div>
            </div>
            <div className="w-full h-[75px] flex justify-end items-center px-4">
                <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-black border border-white text-white flex items-center justify-center hover:bg-gray-900">
                        <DocumentIcon className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-black border border-white text-white flex items-center justify-center hover:bg-gray-900">
                        <SettingsIcon className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-black border border-white text-white flex items-center justify-center hover:bg-gray-900">
                        <SearchIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="px-4 mt-4">
                <h1 className="font-bold text-2xl">{character.name}</h1>
                <p className="text-gray-500">@{character.path}</p>
                <p className="mt-4">{character.bio || "This character doesn't have a bio yet!"}</p>
            </div>
        </>
    );
}

interface DynamicImageProps {
    src: string | null;
    placeholderSrc: string;
    alt: string;
    bucketName: string | null;
    reference: string | null;
    className?: string;
}
function DynamicImage({ src, placeholderSrc, alt, bucketName, reference, className }: DynamicImageProps) {
    if (src) {
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
    if (bucketName && reference) {
        return (
            <UploadImage
                src={placeholderSrc}
                alt={alt}
                fill
                className={className}
                priority
            />
        );
    }
    // SRC is null and required info for upload is missing
    return null;
}