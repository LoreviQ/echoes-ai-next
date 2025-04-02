'use client';

import React, { useState } from 'react';
import { useRightSidebar } from "@/contexts/RightSidebarContext";
import { useThreads, useThreadMessages } from '@/hooks/useThreads';
import { Thread } from '@/types/thread';
import PreviewImage from '@/components/images/PreviewImage';

export function MessagesContent() {
    const { currentCharacter } = useRightSidebar();
    const [selectedThreadId, setSelectedThreadId] = useState<string>();

    const { data: threads, isLoading: threadsLoading } = useThreads(currentCharacter?.id);
    const { data: messages, isLoading: messagesLoading } = useThreadMessages(selectedThreadId);

    // When threads load or change, select the most recent thread
    React.useEffect(() => {
        if (threads && threads.length > 0 && !selectedThreadId) {
            setSelectedThreadId(threads[0].id);
        }
    }, [threads, selectedThreadId]);

    if (!currentCharacter) {
        return null;
    }

    return (
        <div className="flex flex-col h-full">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 relative">
                        <PreviewImage
                            src={currentCharacter.avatar_url || '/default-avatar.png'}
                            alt={`${currentCharacter.name}'s avatar`}
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg">{currentCharacter.name}</span>
                        <span className="text-sm text-zinc-400">@{currentCharacter.path}</span>
                    </div>
                </div>

                <select
                    className="bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm"
                    value={selectedThreadId}
                    onChange={(e) => setSelectedThreadId(e.target.value)}
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

            {/* Messages Content */}
            <div className="flex-1 p-4">
                <p className="text-zinc-400">Messages will be displayed here...</p>
            </div>
        </div>
    );
} 