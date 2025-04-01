'use client';

import React, { useState, useEffect } from 'react';
import { SubmitButton } from '@/components/buttons/SubmitButton';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/utils/supabase.client';
import { PROTECTED_ROUTES } from '@/config/routes';
import SelectImage from '@/components/images/SelectImage';
import { uploadImage } from '@/utils/imageUpload';
import { CircleActionButton } from '@/components/buttons/CircleActionButton';
import { DiceIcon, RightArrowIcon } from '@/assets/icons';
import { getRandomWords } from '@/config/randomValues';

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
    const [tags, setTags] = useState('');
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

    const generateCharacter = async () => {
        const prompt = `Generate a character name and biography based on the following ten words:
${tags}
Remember to provide the output strictly in the specified JSON format: {"name": "character name", "bio": "2-3 paragraph description here"}.
`

        const systemInstruction = `You are an expert character creator and writer. Your task is to generate a character name and biography based on a list of ten descriptive words provided by the user.
You MUST analyze the provided words, even if they seem contradictory, and synthesize them into a coherent and intriguing character concept.

The output MUST be a single, valid JSON object. This JSON object must contain exactly two keys:
1.  \`name\`: A string containing a plausible and fitting name for the character.
2.  \`bio\`: A string containing a compelling character biography of 2-3 paragraphs, reflecting the essence, personality, potential appearance, and backstory hinted at by the provided descriptive words.

Do NOT include any introductory text, explanations, markdown formatting codes (like \`\`\`json), or conversational filler before or after the JSON object.Your entire response must be ONLY the JSON object itself.
`
    }

    return (
        <form onSubmit={handleCreateCharacter} className="space-y-4">
            <div className="relative w-full mb-4">
                <div className="relative w-full aspect-[3/1]">
                    <SelectImage
                        src="/images/banner-placeholder.jpg"
                        alt="Character banner"
                        fill
                        className="object-contain"
                        onFileSelected={setBannerFile}
                    />
                </div>
                <div
                    className="absolute left-4 bottom-0 translate-y-1/2 w-[25%] max-w-[150px] min-w-[80px] aspect-square rounded-full border-4 border-black overflow-hidden pointer-events-auto"
                >
                    <SelectImage
                        src="/images/avatar-placeholder.jpg"
                        alt="Character avatar"
                        fill
                        className="rounded-full object-cover"
                        onFileSelected={setAvatarFile}
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-2 items-center">
                <CircleActionButton
                    onClick={() => {
                        const randomTags = getRandomWords(10);
                        setTags(randomTags.join(', '));
                    }}
                    icon={DiceIcon}
                    className="border border-zinc-600 hover:bg-zinc-600"
                />
                <textarea
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={isSubmitting}
                    rows={2}
                    className="w-[55%] bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200"
                    placeholder={`Generate character from tags\n(e.g. 'cat, magic, funny')`}
                />
                <CircleActionButton
                    onClick={generateCharacter}
                    icon={RightArrowIcon}
                    className="border border-zinc-600 hover:bg-zinc-600"
                />
            </div>
            <div>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200"
                    placeholder="Character name"
                />
            </div>
            <div>
                <input
                    type="text"
                    id="path"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200"
                    placeholder="url-friendly-path"
                />
            </div>
            <div>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    disabled={isSubmitting}
                    className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200"
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
                    <label className="text-sm font-medium text-zinc-200" htmlFor="public">Public</label>
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
                    <label className="text-sm font-medium text-zinc-200" htmlFor="nsfw">NSFW</label>
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
        return `${path} -${Math.random().toString(36).substring(2, 8)} `;
    }

    return path || 'unnamed-character';  // Fallback if empty
}