import { Post } from "@/types/post";
import { Character } from "@/types/character";
import Image from "next/image";
import { formatPostDate } from "@/utils/dateFormat";

interface PostCardProps {
    character: Character;
    post: Post;
}

export function PostCard({ character, post }: PostCardProps) {
    const avatarUrl = character.avatar_url || '/images/avatar-placeholder.jpg';

    return (
        <div className="p-4 border-b border-zinc-600">
            <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <Image
                        src={avatarUrl}
                        alt={`${character.name}'s avatar`}
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-grow">
                    {/* Character Info */}
                    <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{character.name}</span>
                        <span className="text-zinc-500">@{character.path} · {formatPostDate(new Date(post.created_at))}</span>
                    </div>

                    {/* Post Content */}
                    <p className="text-white whitespace-pre-wrap mt-1">{post.content}</p>
                </div>
            </div>
        </div>
    );
} 