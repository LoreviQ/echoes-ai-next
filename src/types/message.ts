export type Message = {
    id: string;
    thread_id: string;
    sender_type: 'user' | 'character';
    content: string;
    created_at: string;
}

// Type for creating a new message - only includes fields that need to be provided
export type CreateMessage = Omit<Message, 'id' | 'created_at'>;

