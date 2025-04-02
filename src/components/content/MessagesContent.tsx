import React from 'react';

export function MessagesContent() {
    return (
        <div className="p-4 border border-zinc-700 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Messages</h3>
            <p className="text-zinc-400">This section will display user messages and conversations.</p>
            <div className="mt-4 space-y-2">
                <div className="p-3 bg-zinc-800 rounded flex">
                    <div className="w-8 h-8 bg-zinc-600 rounded-full mr-2"></div>
                    <div>
                        <p className="font-bold">User 1</p>
                        <p className="text-sm text-zinc-400">Hello there!</p>
                    </div>
                </div>
                <div className="p-3 bg-zinc-800 rounded flex">
                    <div className="w-8 h-8 bg-zinc-600 rounded-full mr-2"></div>
                    <div>
                        <p className="font-bold">User 2</p>
                        <p className="text-sm text-zinc-400">What's new?</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 