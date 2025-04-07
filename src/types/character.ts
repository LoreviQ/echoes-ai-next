export type CharacterSchema = {
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
    appearance: string | null;
}

// Trimmed Types used for database operations
export type CharacterBio = Pick<CharacterSchema, 'name' | 'path' | 'bio'>;
export type CharacterDescription = Pick<CharacterSchema, 'description' | 'appearance'>;
export type CharacterToggles = Pick<CharacterSchema, 'public' | 'nsfw'>;

// Character extended type that includes subscriber_count
export type Character = CharacterSchema & {
    subscriber_count: number;
}

// Type for creating a new character - only includes fields that need to be provided
export type CreateCharacter = Omit<
    CharacterSchema,
    'id' | 'created_at' | 'updated_at' | 'user_id'
>;