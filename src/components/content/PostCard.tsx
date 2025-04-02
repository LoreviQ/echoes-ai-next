import { Post } from "@/types/post";
import { Character } from "@/types/character";
import Image from "next/image";
import { formatPostDate } from "@/utils/dateFormat";
import { CircleActionButton } from "@/components/buttons/CircleActionButton";
import { DotsMenuIcon, SpeechBubbleIcon, RepostIcon, HeartIcon, MiniBarChartIcon } from "@/assets/icons";

interface PostCardProps {
    character: Character;
    post: Post;
}

export function PostCard({ character, post }: PostCardProps) {
    const avatarUrl = character.avatar_url || '/images/avatar-placeholder.jpg';

    return (
        <div className="px-4 py-2 border-b border-zinc-600">
            <div className="flex space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0 pt-2">
                    <Image
                        src={avatarUrl}
                        alt={`${character.name}'s avatar`}
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-grow relative">
                    {/* Menu Button - Top Right */}
                    <div className="absolute right-0 top-0">
                        <CircleActionButton
                            onClick={() => { }}
                            icon={DotsMenuIcon}
                            className="hover:bg-cyan-800/20 hover:text-cyan-800 text-zinc-400"
                            size="sm"
                        />
                    </div>

                    {/* Character Info */}
                    <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{character.name}</span>
                        <span className="text-zinc-500">@{character.path} · {formatPostDate(new Date(post.created_at))}</span>
                    </div>

                    {/* Post Content */}
                    <p className="text-white whitespace-pre-wrap mt-1">{post.content}</p>

                    {/* Action Buttons */}
                    <div className="flex justify-between mt-2 max-w-md">
                        <CircleActionButton
                            onClick={() => { }}
                            icon={SpeechBubbleIcon}
                            className="hover:bg-cyan-800/20 hover:text-cyan-800 text-zinc-400"
                        />
                        <CircleActionButton
                            onClick={() => { }}
                            icon={RepostIcon}
                            className="hover:bg-green-600/20 hover:text-green-600 text-zinc-400"
                        />
                        <CircleActionButton
                            onClick={() => { }}
                            icon={HeartIcon}
                            className="hover:bg-pink-600/20 hover:text-pink-600 text-zinc-400"
                        />
                        <CircleActionButton
                            onClick={() => { }}
                            icon={MiniBarChartIcon}
                            className="hover:bg-cyan-800/20 hover:text-cyan-800 text-zinc-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 