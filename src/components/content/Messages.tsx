'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRightSidebar } from "@/contexts/RightSidebarContext";
import { useThreads, useThreadMessages } from '@/hooks/useThreads';
import { Thread, Message } from '@/types/thread';
import PreviewImage from '@/components/images/PreviewImage';
import { Character } from '@/types/character';
import { RightArrowIcon } from '@/assets/icons';

export function MessagesContent() {
    const { currentCharacter } = useRightSidebar();
    const [selectedThreadId, setSelectedThreadId] = useState<string>();

    const { data: threads, isLoading: threadsLoading } = useThreads(currentCharacter?.id);
    const { data: messages, isLoading: messagesLoading } = useThreadMessages(selectedThreadId);

    // When threads load or change, select the most recent thread
    React.useEffect(() => {
        if (!threadsLoading && threads && threads.length > 0 && !selectedThreadId) {
            setSelectedThreadId(threads[0].id);
        }
    }, [threads, threadsLoading, selectedThreadId]);

    if (!currentCharacter) {
        return null;
    }

    return (
        // 74px is the height of the header - idk why h-full doesn't work
        <div className="flex flex-col h-[calc(100vh-74px)] overflow-hidden">
            <MessagesHeader
                character={currentCharacter}
                selectedThreadId={selectedThreadId}
                onThreadSelect={setSelectedThreadId}
                threads={threads}
                threadsLoading={threadsLoading}
            />
            <ChatWindow
                messages={messages || []}
                isLoading={messagesLoading}
            />
        </div>
    );
}


interface MessagesHeaderProps {
    character: Character;
    selectedThreadId?: string;
    onThreadSelect: (threadId: string) => void;
    threads?: Thread[];
    threadsLoading: boolean;
}

function MessagesHeader({ character, selectedThreadId, onThreadSelect, threads, threadsLoading }: MessagesHeaderProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-zinc-700">
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

            <div className="w-full sm:w-auto ml-auto">
                <select
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm"
                    value={selectedThreadId}
                    onChange={(e) => onThreadSelect(e.target.value)}
                >
                    {threadsLoading ? (
                        <option>Loading threads...</option>
                    ) : threads?.length === 0 ? (
                        <option>No threads available</option>
                    ) : (
                        threads?.map((thread) => (
                            <option key={thread.id} value={thread.id}>
                                {thread.title}
                            </option>
                        ))
                    )}
                </select>
            </div>
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
                className={`max-w-[75%] rounded-lg px-4 py-2 ${isCharacter
                    ? 'bg-zinc-700 text-white'
                    : 'bg-blue-600 text-white'
                    }`}
            >
                <p className="break-words">{message.content}</p>
            </div>
        </div>
    );
}

interface ChatWindowProps {
    messages: Message[];
    isLoading: boolean;
}

function ChatWindow({ messages, isLoading }: ChatWindowProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (isLoading) {
        return <div className="flex-1 p-4 overflow-y-auto"><p>Loading messages...</p></div>;
    }

    return (
        <div className="flex flex-col flex-1 h-full">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
                <div>
                    {messages.length === 0 ? (
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
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full bg-black border border-zinc-600 rounded-xl py-2 pr-10 pl-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 resize-none overflow-hidden"
                    />
                    <RightArrowIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400 transition-colors duration-200 group-focus-within:text-white" />
                </div>
            </div>
        </div>
    );
}

