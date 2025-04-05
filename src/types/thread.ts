export type Thread = {
    id: string;
    user_id: string;
    character_id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

// Type for creating a new thread - only includes fields that need to be provided
export type CreateThread = Pick<Thread, 'user_id' | 'character_id' | 'title'>;

