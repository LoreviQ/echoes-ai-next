import { Character } from "@/types/character";
import { Post } from "@/types/post";
import { createClient } from "@/utils/supabase.client";
import { useEffect, useState } from "react";

export function Posts({ character }: { character: Character }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('character_id', character.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setPosts(data || []);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('Failed to load posts');
            } finally {
                setIsLoading(false);
            }
        }

        fetchPosts();
    }, [character.id]);

    if (isLoading) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-zinc-400">Loading posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="w-full p-4 text-center">
                <p className="text-zinc-400">This character has no posts yet!</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {posts.map((post) => (
                <div key={post.id} className="p-4 border border-zinc-800 rounded-xl">
                    <p className="text-white whitespace-pre-wrap">{post.content}</p>
                    <p className="text-sm text-zinc-400 mt-2">
                        {new Date(post.created_at).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </div>
    );
} 