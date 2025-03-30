"use client";

import React, { useState, useEffect } from 'react';
import { SubmitButton } from '@/components/buttons/SubmitButton';
import { Switch } from '@/components/ui/switch';

export interface CharacterFormData {
    name: string;
    path: string;
    bio: string;
    public: boolean;
    nsfw: boolean;
}

interface CreateCharacterFormProps {
    setIsModalOpen: (isOpen: boolean) => void;
}

export function CreateCharacterForm({ setIsModalOpen }: CreateCharacterFormProps) {
    const [name, setName] = useState('');
    const [path, setPath] = useState('');
    const [bio, setBio] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [isNsfw, setIsNsfw] = useState(false);

    useEffect(() => {
        setPath(nameToPath(name));
    }, [name]);

    const handleCreateCharacter = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate path format
        const pathRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
        if (!pathRegex.test(path)) {
            alert('Path must start and end with a letter or number, and can only contain lowercase letters, numbers, and hyphens');
            return;
        }

        // Check path length
        if (path.length < 1 || path.length > 255) {
            alert('Path must be between 1 and 255 characters');
            return;
        }

        try {
            const characterData: CharacterFormData = {
                name,
                path,
                bio,
                public: isPublic,
                nsfw: isNsfw,
            };

            // TODO: Add your API call here to create the character
            // await createCharacter(characterData);

            setIsModalOpen(false); // Close the modal after successful creation
        } catch (error) {
            console.error('Error creating character:', error);
            // TODO: Add error handling
        }
    };

    return (
        <form onSubmit={handleCreateCharacter} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                    Character Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-black border border-gray-600 rounded-xl py-2 px-4 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors duration-200"
                    placeholder="Enter character name"
                />
            </div>
            <div>
                <label htmlFor="path" className="block text-sm font-medium text-gray-200 mb-1">
                    URL Path
                </label>
                <input
                    type="text"
                    id="path"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    required
                    className="w-full bg-black border border-gray-600 rounded-xl py-2 px-4 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors duration-200"
                    placeholder="url-friendly-path"
                />
            </div>
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-200 mb-1">
                    Bio
                </label>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                    rows={4}
                    className="w-full bg-black border border-gray-600 rounded-xl py-2 px-4 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors duration-200"
                    placeholder="Enter character bio"
                />
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="public"
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                    />
                    <label className="text-sm font-medium text-gray-200" htmlFor="public">Public</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="nsfw"
                        checked={isNsfw}
                        onCheckedChange={setIsNsfw}
                    />
                    <label className="text-sm font-medium text-gray-200" htmlFor="nsfw">NSFW</label>
                </div>
            </div>
            <div className="flex justify-end">
                <SubmitButton label="Create Character" />
            </div>
        </form>
    );
}

function nameToPath(name: string): string {
    if (!name) return '';

    // Convert to lowercase and replace spaces/special chars with hyphens
    const path = name.toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '')     // Remove non-alphanumeric chars (except hyphens)
        .replace(/-+/g, '-')            // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '');       // Remove leading/trailing hyphens

    return path || 'unnamed-character';  // Fallback if empty
}