import { Character } from "@/types/character";
import Image from "next/image";
import Link from "next/link";
import { CircleActionButton } from "@/components/buttons/CircleActionButton";
import { DotsMenuIcon } from "@/assets/icons";

interface CharacterCardProps {
    character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
    const avatarUrl = character.avatar_url || '/images/avatar-placeholder.jpg';
    const characterUrl = `/characters/${character.path}`;

    return (
        <div className="px-4 py-3 border-b border-zinc-600 hover:bg-zinc-900/30 transition-colors">
            <Link href={characterUrl} className="flex space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <Image
                        src={avatarUrl}
                        alt={`${character.name}'s avatar`}
                        width={56}
                        height={56}
                        className="rounded-full"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-grow relative">
                    {/* Menu Button - Top Right */}
                    <div className="absolute right-0 top-0">
                        <CircleActionButton
                            onClick={() => {
                                // Menu action
                            }}
                            icon={DotsMenuIcon}
                            className="hover:bg-cyan-800/20 hover:text-cyan-800 text-zinc-400"
                        />
                    </div>

                    {/* Character Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{character.name}</span>
                            <span className="text-zinc-500">@{character.path}</span>
                        </div>

                        {/* Character Bio */}
                        {character.bio && (
                            <p className="text-zinc-200 mt-1 line-clamp-2">{character.bio}</p>
                        )}

                        {/* Tags if available */}
                        {character.tags && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {character.tags.split(',').map((tag, index) => (
                                    <span key={index} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
} 