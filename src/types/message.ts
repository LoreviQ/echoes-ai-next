export type Message = {
    id: string;
    thread_id: string;
    sender_type: 'user' | 'character';
    content: string;
    created_at: string;
}

export type CreateMessage = Pick<Message, 'thread_id' | 'sender_type' | 'content'>;

