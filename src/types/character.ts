export type Character = {
    id: string;
    user_id: string;
    name: string;
    bio: string | null;
    avatar_url: string | null;
    public: boolean;
    created_at: string;
    updated_at: string;
    path: string;
    nsfw: boolean;
} 