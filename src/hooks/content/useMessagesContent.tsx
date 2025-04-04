'use client';

import React from 'react';
import { useRightSidebar } from "@/contexts/rightSidebar";
import { useSession } from "@/contexts/session.client";
import { Thread, Message } from '@/types/thread';
import PreviewImage from '@/components/images/PreviewImage';
import { Character } from '@/types/character';
import { RightArrowIcon } from '@/assets/icons';
import { MarkdownContent } from '@/components/ui/MarkdownContent';
import { formatFriendlyDate } from '@/utils/dateFormat';

export function useMessagesContent() {
    const { active: isLoggedIn } = useSession();
    const { currentCharacter, getThreadMessages } = useRightSidebar();

    const threadData = isLoggedIn ? getThreadMessages() : null;

    if (!currentCharacter) {
        return {
            header: null,
            content: null
        };
    }

    const header = (
        <MessagesHeader
            character={currentCharacter}
            isLoggedIn={isLoggedIn}
            selectedThreadId={threadData?.selectedThreadId}
            onThreadSelect={threadData?.setSelectedThreadId}
            threads={threadData?.threads}
            threadsLoading={threadData?.threadsLoading ?? false}
        />
    );

    const content = (
        <ChatWindow
            messages={threadData?.messages ?? []}
            isLoading={threadData?.messagesLoading ?? false}
            onSendMessage={threadData?.sendMessage ?? (async () => { })}
            isSending={threadData?.messageSending}
            isLoggedIn={isLoggedIn}
            characterName={currentCharacter.name}
        />
    );

    return {
        header,
        content
    };
}

interface MessagesHeaderProps {
    character: Character;
    isLoggedIn: boolean;
    selectedThreadId?: string;
    onThreadSelect?: (threadId: string) => void;
    threads?: Thread[];
    threadsLoading: boolean;
}

function MessagesHeader({ character, selectedThreadId, onThreadSelect, threads, threadsLoading, isLoggedIn }: MessagesHeaderProps) {
    // Type guard to ensure required props are present when logged in
    if (isLoggedIn && (!onThreadSelect || !threads)) {
        throw new Error('Required props missing for logged in state');
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center justify-center w-full sm:w-auto">
                    <div className="w-10 h-10 relative">
                        <PreviewImage
                            src={character.avatar_url || '/default-avatar.png'}
                            alt={`${character.name}'s avatar`}
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                    <span className="font-bold text-lg">{character.name}</span>
                    <span className="text-sm text-zinc-400">@{character.path}</span>
                </div>
            </div>

            {isLoggedIn && onThreadSelect && threads && (
                <div className="w-full sm:w-auto ml-auto">
                    <select
                        className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm"
                        value={selectedThreadId}
                        onChange={(e) => onThreadSelect(e.target.value)}
                    >
                        {threadsLoading ? (
                            <option>Loading threads...</option>
                        ) : threads.length === 0 ? (
                            <option>No threads available</option>
                        ) : (
                            threads.map((thread) => (
                                <option key={thread.id} value={thread.id}>
                                    {thread.title}
                                </option>
                            ))
                        )}
                    </select>
                </div>
            )}
        </div>
    );
}

interface ChatMessageProps {
    message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
    const isCharacter = message.sender_type === 'character';

    return (
        <div className={`flex ${isCharacter ? 'justify-start' : 'justify-end'} mb-4`}>
            <div
                className={`max-w-[75%] rounded-lg px-4 py-2 relative ${isCharacter
                    ? 'bg-zinc-700 text-white before:absolute before:content-[""] before:w-4 before:h-4 before:bg-zinc-700 before:-bottom-2 before:left-2 before:skew-x-[-35deg] before:rounded-br-lg'
                    : 'bg-blue-800 text-white before:absolute before:content-[""] before:w-4 before:h-4 before:bg-blue-800 before:-bottom-2 before:right-2 before:skew-x-[35deg] before:rounded-bl-lg'
                    }`}
            >
                <MarkdownContent content={message.content} className="break-words" />
                <div className={`text-xs text-zinc-400 mt-1 ${isCharacter ? 'text-left' : 'text-right'}`}>
                    {formatFriendlyDate(new Date(message.created_at))}
                </div>
            </div>
        </div>
    );
}

interface ChatWindowProps {
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (content: string) => Promise<void>;
    isSending?: boolean;
    isLoggedIn: boolean;
    characterName: string;
}

function ChatWindow({ messages, isLoading, onSendMessage, isSending, isLoggedIn, characterName }: ChatWindowProps) {
    const [inputValue, setInputValue] = React.useState('');
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Type guard to ensure required props are present when logged in
    if (isLoggedIn && !onSendMessage) {
        throw new Error('Required props missing for logged in state');
    }

    // Scroll to bottom when messages change
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        const trimmedContent = inputValue.trim();
        if (trimmedContent && !isSending) {
            try {
                setInputValue('');
                await onSendMessage(trimmedContent);
            } catch (error) {
                console.error('Failed to send message:', error);
                // Optionally restore the input value on error
                setInputValue(trimmedContent);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (isLoading && isLoggedIn) {
        return <div className="flex-1 p-4 overflow-y-auto"><p>Loading messages...</p></div>;
    }

    return (
        <div className="flex flex-col flex-1 h-full">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
                <div>
                    {!isLoggedIn ? (
                        <div className="flex justify-center items-center text-zinc-500">
                            You must be logged in to chat with {characterName}
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex justify-center items-center text-zinc-500">
                            No messages yet...
                        </div>
                    ) : (
                        messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input field */}
            <div className="p-4 border-t border-zinc-700">
                <div className="relative group w-full">
                    <textarea
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            // Auto-resize the textarea
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={isLoggedIn ? "Type a message..." : "Please log in to send messages"}
                        rows={1}
                        disabled={isSending || !isLoggedIn}
                        className="w-full bg-black border border-zinc-600 rounded-xl py-2 pr-10 pl-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 resize-none overflow-hidden disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isSending || !isLoggedIn}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 disabled:opacity-50"
                    >
                        <RightArrowIcon className="w-5 h-5 text-zinc-400 transition-colors duration-200 group-focus-within:text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
} 