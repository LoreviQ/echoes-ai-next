'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

import { Message } from '@/types';
import { useRightSidebar, useSession } from "@/contexts";
import { RightArrowIcon } from '@/assets';
import { MarkdownContent } from '@/components/ui';
import { formatFriendlyDate } from '@/utils';

const MessagesHeaderComponent = () => {
    const { active: isLoggedIn } = useSession();
    const { currentCharacter, getThreadMessages } = useRightSidebar();
    const threadData = isLoggedIn ? getThreadMessages() : null;

    if (!currentCharacter) {
        return null;
    }

    if (!threadData) {
        throw new Error('Required props missing for logged in state');
    }

    return (
        <div className="w-full sm:w-auto ml-auto">
            <select
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm"
                value={threadData.selectedThreadId}
                onChange={(e) => threadData.setSelectedThreadId(e.target.value)}
            >
                {threadData.threadsLoading ? (
                    <option>Loading threads...</option>
                ) : !threadData.threads ? (
                    <option>No threads available</option>
                ) : threadData.threads.length === 0 ? (
                    <option>No threads available</option>
                ) : (
                    threadData.threads.map((thread) => (
                        <option key={thread.id} value={thread.id}>
                            {thread.title}
                        </option>
                    ))
                )}
            </select>
        </div>
    )
}

const MessagesContentComponent = () => {
    const { active: isLoggedIn } = useSession();
    const { currentCharacter, getThreadMessages } = useRightSidebar();
    const threadData = isLoggedIn ? getThreadMessages() : null;
    const [inputValue, setInputValue] = React.useState('');
    const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Focus textarea on mount
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [threadData?.messages]);

    // Set status message based on current state
    useEffect(() => {
        if (!currentCharacter) {
            setStatusMessage(null);
            return;
        }

        if (!isLoggedIn) {
            setStatusMessage(`You must be logged in to chat with ${currentCharacter.name}`);
            return;
        }

        if (threadData?.messagesLoading) {
            setStatusMessage('Loading messages...');
            return;
        }

        if (threadData?.messages.length === 0) {
            setStatusMessage('No messages yet...');
            return;
        }

        setStatusMessage(null);
    }, [currentCharacter, isLoggedIn, threadData?.messagesLoading, threadData?.messages?.length]);

    // blank content if no character
    if (!currentCharacter) {
        return null;
    }

    // Type guard to ensure required props are present when logged in
    if (isLoggedIn && !threadData) {
        throw new Error('Required props missing for logged in state');
    }

    const handleSendMessage = async () => {
        const trimmedContent = inputValue.trim();
        if (trimmedContent && !threadData?.messageSending) {
            try {
                setInputValue('');
                await threadData?.sendMessage(trimmedContent);
                // Add a small delay before focusing or itwon't work?
                setTimeout(() => {
                    textareaRef.current?.focus();
                }, 0);
            } catch (error) {
                console.error('Failed to send message:', error);
                // Restore the input value on error
                setInputValue(trimmedContent);
            }
        }
    };

    // Send message on Enter key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };


    return (
        <div className="flex flex-col flex-1 h-full">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
                <div>
                    {statusMessage ? (
                        <div className="flex justify-center items-center text-zinc-500">
                            {statusMessage}
                        </div>
                    ) : (
                        threadData?.messages.map((message) => (
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
                        ref={textareaRef}
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
                        disabled={threadData?.messageSending || !isLoggedIn}
                        className="w-full bg-black border border-zinc-600 rounded-xl py-2 pr-10 pl-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 resize-none overflow-hidden disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || threadData?.messageSending || !isLoggedIn}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 disabled:opacity-50"
                    >
                        <RightArrowIcon className="w-5 h-5 text-zinc-400 transition-colors duration-200 group-focus-within:text-white" />
                    </button>
                </div>
            </div>
        </div>
    )
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

// Export the dynamic components
export const MessagesHeader = dynamic(() => Promise.resolve(MessagesHeaderComponent), {
    ssr: false
});

export const MessagesContent = dynamic(() => Promise.resolve(MessagesContentComponent), {
    ssr: false
});