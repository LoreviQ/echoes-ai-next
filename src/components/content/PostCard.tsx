import { Post } from "@/types/post";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <div className="p-4 border border-zinc-800 rounded-xl">
            <p className="text-white whitespace-pre-wrap">{post.content}</p>
            <p className="text-sm text-zinc-400 mt-2">
                {new Date(post.created_at).toLocaleDateString()}
            </p>
        </div>
    );
} 