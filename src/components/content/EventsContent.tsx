import React from 'react';

export function EventsContent() {
    return (
        <div className="p-4 border border-zinc-700 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Events</h3>
            <p className="text-zinc-400">This section will display upcoming events and activities.</p>
            <div className="mt-4 space-y-2">
                <div className="p-3 bg-zinc-800 rounded">Event 1</div>
                <div className="p-3 bg-zinc-800 rounded">Event 2</div>
                <div className="p-3 bg-zinc-800 rounded">Event 3</div>
            </div>
        </div>
    );
} 