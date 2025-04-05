export type Thread = {
    id: string;
    user_id: string;
    character_id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

// Type for creating a new thread - only includes fields that need to be provided
export type CreateThread = Omit<Thread, 'id' | 'created_at' | 'updated_at' | 'user_id'>;

