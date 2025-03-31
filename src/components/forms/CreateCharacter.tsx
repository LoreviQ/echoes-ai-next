'use client';

import React, { useState, useEffect } from 'react';
import { SubmitButton } from '@/components/buttons/SubmitButton';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/utils/supabase.client';
import { PROTECTED_ROUTES } from '@/config/routes';
import SelectImage from '@/components/images/SelectImage';
import { uploadImage } from '@/utils/imageUpload';

export interface CharacterFormData {
    name: string;
    path: string;
    bio: string;
    public: boolean;
    nsfw: boolean;
    avatar_url?: string | null;
    banner_url?: string | null;
}

interface CreateCharacterFormProps {
    onSuccess?: () => void;
}

export function CreateCharacterForm({ onSuccess }: CreateCharacterFormProps) {
    const [name, setName] = useState('');
    const [path, setPath] = useState('');
    const [bio, setBio] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [isNsfw, setIsNsfw] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const supabase = createClient();

    useEffect(() => {
        setPath(nameToPath(name));
    }, [name]);

    const validateForm = (): boolean => {
        // Validate path format
        const pathRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
        if (!pathRegex.test(path)) {
            setError('Path must start and end with a letter or number, and can only contain lowercase letters, numbers, and hyphens');
            return false;
        }

        // Check path length
        if (path.length < 1 || path.length > 255) {
            setError('Path must be between 1 and 255 characters');
            return false;
        }

        // Check for protected routes
        if (PROTECTED_ROUTES.includes(path as any)) {
            setError('This path name is reserved. Please choose a different name.');
            return false;
        }

        return true;
    };

    const handleCreateCharacter = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent submission if already submitting
        if (isSubmitting) {
            return;
        }

        setError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (!user || userError) {
                throw new Error('Authentication error');
            }

            // Upload images if provided
            let avatarUrl = null;
            let bannerUrl = null;

            if (avatarFile) {
                avatarUrl = await uploadImage(avatarFile, 'character-avatars');
                if (!avatarUrl) {
                    throw new Error('Failed to upload avatar image');
                }
            }

            if (bannerFile) {
                bannerUrl = await uploadImage(bannerFile, 'character-banners');
                if (!bannerUrl) {
                    throw new Error('Failed to upload banner image');
                }
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
                    avatar_url: avatarUrl,
                    banner_url: bannerUrl
                });

            if (insertError) {
                console.error('Error creating character:', insertError);
                throw insertError;
            }

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error creating character:', error);
            setError('Failed to create character. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleCreateCharacter} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                            Character Avatar
                        </label>
                        <div className="relative w-32 h-32 mx-auto">
                            <SelectImage
                                src="/images/avatar-placeholder.jpg"
                                alt="Character avatar"
                                fill
                                className="rounded-full object-cover"
                                onFileSelected={setAvatarFile}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                            Character Banner
                        </label>
                        <div className="relative w-full h-32">
                            <SelectImage
                                src="/images/banner-placeholder.jpg"
                                alt="Character banner"
                                fill
                                className="object-cover rounded-md"
                                onFileSelected={setBannerFile}
                            />
                        </div>
                    </div>
                </div>
            </div>
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    className="w-full bg-black border border-gray-600 rounded-xl py-2 px-4 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors duration-200"
                    placeholder="Enter character bio (optional)"
                />
            </div>
            <div className="flex items-center justify-center space-x-12">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="public"
                        checked={isPublic}
                        onCheckedChange={(checked) => {
                            if (!isSubmitting) {
                                setIsPublic(checked);
                            }
                        }}
                        className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                    />
                    <label className="text-sm font-medium text-gray-200" htmlFor="public">Public</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="nsfw"
                        checked={isNsfw}
                        onCheckedChange={(checked) => {
                            if (!isSubmitting) {
                                setIsNsfw(checked);
                            }
                        }}
                        className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                    />
                    <label className="text-sm font-medium text-gray-200" htmlFor="nsfw">NSFW</label>
                </div>
            </div>
            <div className="flex justify-end">
                {error && (
                    <div className="text-red-500 text-sm mr-4 self-center">{error}</div>
                )}
                <SubmitButton
                    label="Create Character"
                    className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                />
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