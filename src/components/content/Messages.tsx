'use client';

import React, { useState } from 'react';
import { useRightSidebar } from "@/contexts/RightSidebarContext";
import { useThreads, useThreadMessages, useCreateThread } from '@/hooks/useThreads';
import { Thread } from '@/types/thread';
import PreviewImage from '@/components/images/PreviewImage';
import { Character } from '@/types/character';

export function MessagesContent() {
    const { currentCharacter } = useRightSidebar();
    const [selectedThreadId, setSelectedThreadId] = useState<string>();
    const { mutateAsync: createThread } = useCreateThread();

    const { data: threads, isLoading: threadsLoading } = useThreads(currentCharacter?.id);
    const { data: messages, isLoading: messagesLoading } = useThreadMessages(selectedThreadId);

    // When threads load or change, select the most recent thread or create a new one if none exist
    React.useEffect(() => {
        if (!threadsLoading && currentCharacter) {
            if (threads && threads.length > 0) {
                if (!selectedThreadId) {
                    setSelectedThreadId(threads[0].id);
                }
            } else {
                // No threads exist, create a new one
                createThread({ characterId: currentCharacter.id })
                    .then((thread: Thread) => {
                        setSelectedThreadId(thread.id);
                    })
                    .catch((error: Error) => {
                        console.error('Error creating thread:', error);
                    });
            }
        }
    }, [threads, threadsLoading, currentCharacter, selectedThreadId, createThread]);

    if (!currentCharacter) {
        return null;
    }

    return (
        <div className="flex flex-col">
            <MessagesHeader
                character={currentCharacter}
                selectedThreadId={selectedThreadId}
                onThreadSelect={setSelectedThreadId}
                threads={threads}
                threadsLoading={threadsLoading}
            />

            {/* Messages Content */}
            <div className="flex-1 p-4">
                <p className="text-zinc-400">Messages will be displayed here...</p>
            </div>
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

