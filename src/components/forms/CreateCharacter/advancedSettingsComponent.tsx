import React, { useState, useRef, useEffect } from 'react';

interface AdvancedSettingsProps {
    state: any;
    dispatch: React.Dispatch<any>;
}

export function AdvancedSettings({ state, dispatch }: AdvancedSettingsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (isExpanded && headingRef.current) {
            // Small delay to ensure DOM has updated
            setTimeout(() => {
                headingRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }, [isExpanded]);

    return (
        <div className="p-4">
            <button
                type="button"
                className="flex items-center w-full text-center font-medium group"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h1 ref={headingRef} className="flex-grow text-center group-hover:underline text-xl">Advanced Settings</h1>
            </button>

            {isExpanded && (
                <div className="mt-4 space-y-4">
                    <AdvancedSettingsForm state={state} dispatch={dispatch} />
                </div>
            )}
        </div>
    );
}

export function AdvancedSettingsForm({ state, dispatch }: AdvancedSettingsProps) {
    return (
        <div className="flex items-center">
            <label htmlFor="path" className="pl-2 w-[15%] text-sm font-medium text-zinc-200">Path</label>
            <input
                type="text"
                id="path"
                value={state.path}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'path', value: e.target.value })}
                required
                disabled={state.isSubmitting || state.isGenerating}
                className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50"
                placeholder="url-friendly-path"
            />
        </div>
    );
}