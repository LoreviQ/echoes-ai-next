import React, { useState, useEffect } from 'react';
import { SubmitButton } from '@/components/buttons/SubmitButton';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/utils/supabase.client';
import { PROTECTED_ROUTES } from '@/config/routes';

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
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        setPath(nameToPath(name));
    }, [name]);

    const handleCreateCharacter = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate path format
        const pathRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
        if (!pathRegex.test(path)) {
            setError('Path must start and end with a letter or number, and can only contain lowercase letters, numbers, and hyphens');
            return;
        }

        // Check path length
        if (path.length < 1 || path.length > 255) {
            setError('Path must be between 1 and 255 characters');
            return;
        }

        // Check for protected routes
        if (PROTECTED_ROUTES.includes(path as any)) {
            setError('This path name is reserved. Please choose a different name.');
            return;
        }

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (!user || userError) {
                throw new Error('Authentication error');
            }

            const { error: insertError } = await supabase
                .from('characters')
                .insert({
                    user_id: user.id,
                    name,
                    path,
                    bio: bio || null,
                    public: isPublic,
                    nsfw: isNsfw,
                    avatar_url: null
                });

            if (insertError) {
                console.error('Error creating character:', insertError);
                throw insertError;
            }

            setIsModalOpen(false); // Close the modal after successful creation
        } catch (error) {
            console.error('Error creating character:', error);
            setError('Failed to create character. Please try again.');
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
                    rows={4}
                    className="w-full bg-black border border-gray-600 rounded-xl py-2 px-4 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors duration-200"
                    placeholder="Enter character bio (optional)"
                />
            </div>
            <div className="flex items-center justify-center space-x-12">
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
                {error && (
                    <div className="text-red-500 text-sm mr-4 self-center">{error}</div>
                )}
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

    // If the path matches a protected route, append a random string
    if (PROTECTED_ROUTES.includes(path as any)) {
        return `${path}-${Math.random().toString(36).substring(2, 8)}`;
    }

    return path || 'unnamed-character';  // Fallback if empty
}