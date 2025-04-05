export type Character = {
    id: string;
    user_id: string;
    name: string;
    bio: string | null;
    description: string | null;
    avatar_url: string | null;
    banner_url: string | null;
    public: boolean;
    created_at: string;
    updated_at: string;
    path: string;
    nsfw: boolean;
    tags: string;
    gender: string;
}

// Type for creating a new character - only includes fields that need to be provided
export type CreateCharacter = Omit<
    Character,
    'id' | 'created_at' | 'updated_at'
>;