import { Character } from "@/types/character";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PreviewImage } from "@/components/images";
import { SubscriptionButton } from "@/components/buttons";

export function CharacterCard({ character }: { character: Character }) {
    const router = useRouter();
    const avatarUrl = character.avatar_url || '/images/avatar-placeholder.jpg';
    const characterUrl = `/${character.path}`;

    // Process tags
    const tags = character.tags ? character.tags.split(',').map(tag => tag.trim()) : [];
    const visibleTags = tags.slice(0, 5);
    const hiddenTags = tags.slice(5);
    const hasHiddenTags = hiddenTags.length > 0;

    const handleTagClick = (e: React.MouseEvent, tag: string) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/search?charactertags=${encodeURIComponent(tag)}`);
    };

    return (
        <div className="px-4 py-3 border-b border-zinc-600 hover:bg-zinc-900/30 transition-colors">
            <Link href={characterUrl} className="flex space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0 relative w-[56px] h-[56px]">
                    <PreviewImage
                        src={avatarUrl}
                        alt={`${character.name}'s avatar`}
                        fill
                        className="rounded-full object-cover"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-grow relative">
                    {/* Character Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span className="text-white font-medium">{character.name}</span>
                                <span className="text-zinc-500 text-sm">@{character.path}</span>
                            </div>
                            <div className="flex-grow"></div>
                            <SubscriptionButton characterId={character.id} />
                        </div>

                        {/* Character Bio */}
                        {character.bio && (
                            <p className="text-zinc-200 mt-1 line-clamp-2">{character.bio}</p>
                        )}

                        {/* Tags if available */}
                        {character.tags && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {visibleTags.map((tag, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => handleTagClick(e, tag)}
                                        className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full hover:bg-zinc-700 transition-colors"
                                    >
                                        {tag}
                                    </button>
                                ))}
                                {hasHiddenTags && (
                                    <span
                                        className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full"
                                        title={hiddenTags.join(', ')}
                                    >
                                        +{hiddenTags.length} more...
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
} 