import Link from "next/link";

import { useCharacter, usePost } from "@/hooks/reactQuery";
import { DotsMenuIcon, SpeechBubbleIcon, RepostIcon, HeartIcon, MiniBarChartIcon } from "@/assets";
import { formatFriendlyDate } from "@/utils";
import { CircleActionButton } from "@/components/buttons";
import { MarkdownContent } from "@/components/ui";
import { PreviewImage } from "@/components/images";

export function PostCard({ postId }: { postId: string }) {
    const { data: post, isLoading: isLoadingPost, error: postError } = usePost(postId);
    const { data: character, isLoading: isLoadingCharacter, error: characterError } = useCharacter(post?.character_id || '');

    if (isLoadingPost || (post && isLoadingCharacter)) {
        return (
            <div className="px-4 py-2 border-b border-zinc-600">
                <div className="w-full text-center">
                    <p className="text-zinc-400">Loading post...</p>
                </div>
            </div>
        );
    }

    if (postError || !post || characterError || !character) {
        return (
            <div className="px-4 py-2 border-b border-zinc-600">
                <div className="w-full text-center">
                    <p className="text-red-500">Failed to load post</p>
                </div>
            </div>
        );
    }

    const avatarUrl = character.avatar_url || '/images/avatar-placeholder.jpg';
    return (
        <div className="px-4 py-2 border-b border-zinc-600">
            <div className="flex space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0 pt-2">
                    <PreviewImage
                        src={avatarUrl}
                        alt={`${character.name}'s avatar`}
                        className="rounded-full"
                        width={48}
                        height={48}
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
                        <span className="text-white font-bold">{character.name}</span>
                        <span className="text-zinc-500"><Link href={`/${character.path}`} className="hover:underline">@{character.path}</Link> · {formatFriendlyDate(new Date(post.created_at))}</span>
                    </div>

                    {/* Post Content */}
                    <div className="text-white mt-1">
                        <MarkdownContent content={post.content} />
                    </div>

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
