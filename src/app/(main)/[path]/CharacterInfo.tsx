import { CharacterActions } from "./CharacterActions";
import { Character } from "@/types";
import { DynamicImage } from "@/components/images";
import { MarkdownContent } from "@/components/ui";

export function CharacterInfo({ character, isOwner }: { character: Character, isOwner: boolean }) {
    return (
        <div className="w-full">
            <div className="relative w-full">
                <div className="relative w-full aspect-[3/1]">
                    <DynamicImage
                        src={character.banner_url}
                        placeholderSrc="/images/banner-placeholder.jpg"
                        alt="Character banner"
                        bucketName="character-banners"
                        cellReference={{
                            tableName: "characters",
                            columnName: "banner_url",
                            id: character.id
                        }}
                        upload={isOwner}
                        className="object-contain"
                    />
                </div>

                {/* Avatar positioned relative to the container */}
                <div
                    className="absolute left-4 bottom-0 translate-y-1/2 w-[25%] max-w-[150px] min-w-[80px] aspect-square rounded-full border-4 border-black overflow-hidden"
                >
                    <DynamicImage
                        src={character.avatar_url}
                        placeholderSrc="/images/avatar-placeholder.jpg"
                        alt="Character avatar"
                        bucketName="character-avatars"
                        cellReference={{
                            tableName: "characters",
                            columnName: "avatar_url",
                            id: character.id
                        }}
                        upload={isOwner}
                        className="rounded-full object-cover"
                    />
                </div>
            </div>
            <CharacterActions character={character} isOwner />
            <div className="px-4 mt-4">
                <h1 className="font-bold text-2xl">{character.name}</h1>
                <p className="text-zinc-500">@{character.path}</p>
                <div className="py-4 text-white">
                    <MarkdownContent
                        content={character.bio || "This character doesn't have a bio yet!"}
                    />
                </div>
            </div>
        </div>
    );
}