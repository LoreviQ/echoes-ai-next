import { CharacterActions } from "./CharacterActions";
import { DynamicImage } from "@/components/images";
import { EditableBio } from "./EditableBio";
import type { Character } from 'echoes-shared/types';

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
            <EditableBio character={character} isOwner />
        </div>
    );
}
