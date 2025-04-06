'use client';

import React from 'react';
import { Switch } from '@/components/ui';
import { nameToPath } from '@/utils';
import { Gender } from '@/types';

import { FormState, FormAction } from './reducer';

// Props for the DetailsSection component
interface DetailsSectionProps {
    state: FormState;
    dispatch: React.Dispatch<FormAction>;
}

// Component for the details form fields (renamed from MainForm)
export const DetailsSection: React.FC<DetailsSectionProps> = ({
    state,
    dispatch
}) => {
    const { name, path, bio, description, appearance,
        gender, customGender, isPublic, isNsfw, isSubmitting, isGenerating } = state;

    return (
        <div className="p-4 flex flex-col space-y-4">
            <div className="flex items-center">
                <label htmlFor="name" className="pl-2 w-[15%] text-sm font-medium text-zinc-200">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                        dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value });
                        // Also update path based on name
                        dispatch({ type: 'SET_FIELD', field: 'path', value: nameToPath(e.target.value) });
                    }}
                    required
                    disabled={isSubmitting || isGenerating}
                    className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50"
                    placeholder="Character name"
                />
            </div>
            <div className="flex items-center">
                <label htmlFor="gender" className="pl-2 w-[15%] text-sm font-medium text-zinc-200">Gender</label>
                <div className="flex w-full space-x-2">
                    <select
                        id="gender"
                        value={gender}
                        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'gender', value: e.target.value as Gender })}
                        disabled={isSubmitting || isGenerating}
                        className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50"
                    >
                        {Object.values(Gender).map((genderValue) => (
                            <option key={genderValue} value={genderValue}>
                                {genderValue}
                            </option>
                        ))}
                    </select>
                    {gender === Gender.CUSTOM && (
                        <input
                            type="text"
                            value={customGender}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'customGender', value: e.target.value })}
                            disabled={isSubmitting || isGenerating}
                            className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50"
                            placeholder="Enter custom gender"
                        />
                    )}
                </div>
            </div>
            <div className="flex flex-col space-y-2">
                <div className="flex items-center px-2 space-x-2">
                    <label htmlFor="bio" className="text-sm font-medium text-zinc-200">Bio</label>
                    <span className="text-xs text-zinc-400">Appears on your characters profile</span>
                </div>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'bio', value: e.target.value })}
                    rows={3}
                    maxLength={200}
                    disabled={isSubmitting || isGenerating}
                    className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50 resize-none"
                    placeholder="Enter character bio (optional)"
                />
            </div>
            <div className="flex flex-col space-y-2">
                <div className="flex items-center px-2 space-x-2">
                    <label htmlFor="description" className="text-sm font-medium text-zinc-200">Description</label>
                    <span className="text-xs text-zinc-400">A general description of your character</span>
                </div>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => {
                        dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value });
                        // Auto-grow functionality
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    rows={3}
                    disabled={isSubmitting || isGenerating}
                    className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50 min-h-[72px] overflow-hidden"
                    placeholder="Enter character description (optional)"
                />
            </div>
            <div className="flex flex-col space-y-2">
                <div className="flex items-center px-2 space-x-2">
                    <label htmlFor="appearance" className="text-sm font-medium text-zinc-200">Appearance</label>
                    <span className="text-xs text-zinc-400">A physical description of your character</span>
                </div>
                <textarea
                    id="appearance"
                    value={appearance}
                    onChange={(e) => {
                        dispatch({ type: 'SET_FIELD', field: 'appearance', value: e.target.value });
                        // Auto-grow functionality
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    rows={3}
                    disabled={isSubmitting || isGenerating}
                    className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50 min-h-[72px] overflow-hidden"
                    placeholder="Enter character appearance (optional)"
                />
            </div>
            <div className="flex items-center justify-center space-x-12">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="public"
                        checked={isPublic}
                        onCheckedChange={(checked) => {
                            if (!isSubmitting && !isGenerating) {
                                dispatch({ type: 'SET_FIELD', field: 'isPublic', value: checked });
                            }
                        }}
                        className={(isSubmitting || isGenerating) ? "opacity-50 cursor-not-allowed" : ""}
                    />
                    <label className="text-sm font-medium text-zinc-200" htmlFor="public">Public</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="nsfw"
                        checked={isNsfw}
                        onCheckedChange={(checked) => {
                            if (!isSubmitting && !isGenerating) {
                                dispatch({ type: 'SET_FIELD', field: 'isNsfw', value: checked });
                            }
                        }}
                        className={(isSubmitting || isGenerating) ? "opacity-50 cursor-not-allowed" : ""}
                    />
                    <label className="text-sm font-medium text-zinc-200" htmlFor="nsfw">NSFW</label>
                </div>
            </div>
        </div>
    );
}; 