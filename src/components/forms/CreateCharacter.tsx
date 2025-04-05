'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitButton } from '@/components/buttons/SubmitButton';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/utils/supabase.client';
import { PROTECTED_ROUTES } from '@/config/routes';
import SelectImage from '@/components/images/SelectImage';
import { uploadImage } from '@/utils/imageUpload';
import { CircleActionButton } from '@/components/buttons/CircleActionButton';
import { DiceIcon, RightArrowIcon, LoadingSpinner, GenerateIcon } from '@/assets';
import { getRandomWords } from '@/config/randomValues';
import { api, endpoints } from '@/utils/api';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { useDropdown } from '@/hooks/ui/useDropdown';
import { useQueryClient } from '@tanstack/react-query';
import { useCharactersInvalidation } from '@/hooks/reactQuery/useCharacters';

// Character form query key - use array format for proper typing
const CHARACTER_FORM_KEY = ['character-form-state'];

enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    NA = 'Not Applicable',
    CUSTOM = 'Custom'
}

const parseGender = (input: string): { gender: Gender; customValue?: string } => {
    const normalized = input.trim().toLowerCase();

    if (normalized.includes('female')) {
        return { gender: Gender.FEMALE };
    }
    if (normalized.includes('male')) {
        return { gender: Gender.MALE };
    }
    if (normalized.includes('n/a') || normalized.includes('not applicable') || normalized.includes('not-applicable') || normalized === 'na') {
        return { gender: Gender.NA };
    }

    return { gender: Gender.CUSTOM, customValue: input.trim() };
};

export interface CharacterFormData {
    name: string;
    path: string;
    bio: string;
    public: boolean;
    nsfw: boolean;
    avatar_url?: string | null;
    banner_url?: string | null;
    gender: string;
}

interface CreateCharacterFormProps {
    modal?: boolean;
    onSuccess?: () => void;
}

// Add a type for the form state that will be stored
interface StoredFormState {
    name: string;
    path: string;
    bio: string;
    description: string;
    gender: Gender;
    customGender: string;
    isPublic: boolean;
    isNsfw: boolean;
    tags: string;
    avatarFile: string | null;
    bannerFile: string | null;
}

export function CreateCharacterForm({ onSuccess, modal = false }: CreateCharacterFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { invalidateCharacters } = useCharactersInvalidation();
    const { isOpen, toggle, close, dropdownRef } = useDropdown();
    const [tags, setTags] = useState('');
    const [name, setName] = useState('');
    const [path, setPath] = useState('');
    const [bio, setBio] = useState('');
    const [description, setDescription] = useState('');
    const [gender, setGender] = useState<Gender>(Gender.NA);
    const [customGender, setCustomGender] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [isNsfw, setIsNsfw] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
    const [isGeneratingBanner, setIsGeneratingBanner] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | string | null>(null);
    const [bannerFile, setBannerFile] = useState<File | string | null>(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('/images/avatar-placeholder.jpg');
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState('/images/banner-placeholder.jpg');
    const supabase = createClient();

    // Load form state from React Query cache on component mount
    useEffect(() => {
        console.log('loading form state');
        const savedState = queryClient.getQueryData<StoredFormState>(CHARACTER_FORM_KEY);

        if (savedState) {
            setName(savedState.name || '');
            setPath(savedState.path || '');
            setBio(savedState.bio || '');
            setDescription(savedState.description || '');
            setGender(savedState.gender || Gender.NA);
            setCustomGender(savedState.customGender || '');
            setIsPublic(savedState.isPublic);
            setIsNsfw(savedState.isNsfw);
            setTags(savedState.tags || '');

            // Only set file URLs, not File objects
            if (savedState.avatarFile) {
                setAvatarFile(savedState.avatarFile);
            }

            if (savedState.bannerFile) {
                setBannerFile(savedState.bannerFile);
            }
        }
    }, [queryClient]);

    // Save form state to React Query cache when any field changes
    useEffect(() => {
        console.log('saving form state');
        // Don't save if we're just loading the initial state or submitting
        if (isSubmitting || isGenerating) return;
        const formState: StoredFormState = {
            name,
            path,
            bio,
            description,
            gender,
            customGender,
            isPublic,
            isNsfw,
            tags,
            // Only save string URLs, not File objects
            avatarFile: typeof avatarFile === 'string' ? avatarFile : null,
            bannerFile: typeof bannerFile === 'string' ? bannerFile : null
        };
        queryClient.setQueryData(CHARACTER_FORM_KEY, formState);
    }, [name, path, bio, description, gender, customGender, isPublic, isNsfw, tags, avatarFile, bannerFile, isSubmitting, isGenerating, queryClient]);

    // Clear form state after successful submission
    const clearFormState = () => {
        queryClient.removeQueries({ queryKey: CHARACTER_FORM_KEY });
    };

    useEffect(() => {
        setPath(nameToPath(name));
    }, [name]);

    // Update preview URLs when files or URLs change
    useEffect(() => {
        if (avatarFile) {
            if (typeof avatarFile === 'string') {
                setAvatarPreviewUrl(avatarFile);
            } else {
                // For File objects, create an object URL
                const objectUrl = URL.createObjectURL(avatarFile);
                setAvatarPreviewUrl(objectUrl);

                // Clean up the URL when component unmounts or file changes
                return () => {
                    URL.revokeObjectURL(objectUrl);
                };
            }
        } else {
            setAvatarPreviewUrl('/images/avatar-placeholder.jpg');
        }
    }, [avatarFile]);

    useEffect(() => {
        if (bannerFile) {
            if (typeof bannerFile === 'string') {
                setBannerPreviewUrl(bannerFile);
            } else {
                // For File objects, create an object URL
                const objectUrl = URL.createObjectURL(bannerFile);
                setBannerPreviewUrl(objectUrl);

                // Clean up the URL when component unmounts or file changes
                return () => {
                    URL.revokeObjectURL(objectUrl);
                };
            }
        } else {
            setBannerPreviewUrl('/images/banner-placeholder.jpg');
        }
    }, [bannerFile]);

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

            // Upload images if provided as Files, use direct URLs if strings
            let avatarUrl = null;
            let bannerUrl = null;

            if (avatarFile) {
                if (typeof avatarFile === 'string') {
                    // If it's already a URL, use it directly
                    avatarUrl = avatarFile;
                } else {
                    // If it's a File object, upload it
                    avatarUrl = await uploadImage(avatarFile, 'character-avatars');
                    if (!avatarUrl) {
                        throw new Error('Failed to upload avatar image');
                    }
                }
            }

            if (bannerFile) {
                if (typeof bannerFile === 'string') {
                    // If it's already a URL, use it directly
                    bannerUrl = bannerFile;
                } else {
                    // If it's a File object, upload it
                    bannerUrl = await uploadImage(bannerFile, 'character-banners');
                    if (!bannerUrl) {
                        throw new Error('Failed to upload banner image');
                    }
                }
            }

            const { error: insertError } = await supabase
                .from('characters')
                .insert({
                    user_id: user.id,
                    name,
                    path,
                    bio: bio || null,
                    description: description || null,
                    public: isPublic,
                    nsfw: isNsfw,
                    avatar_url: avatarUrl,
                    banner_url: bannerUrl,
                    tags: tags,
                    gender: gender === Gender.CUSTOM ? customGender : gender
                });

            if (insertError) {
                console.error('Error creating character:', insertError);
                throw insertError;
            }

            // Clear form state after successful creation
            clearFormState();

            // Invalidate characters query to refresh the list
            invalidateCharacters();

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }

            // Redirect to the character's path
            router.push(`/${path}`);
        } catch (error) {
            console.error('Error creating character:', error);
            setError('Failed to create character. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateCharacter = async () => {
        setIsGenerating(true);
        try {
            const { data } = await api.post(endpoints.characters.generate, {
                tags: tags,
            });
            if (data.success && data.content) {
                setName(data.content.name);
                setBio(data.content.bio);
                setDescription(data.content.description);
                const parsedGender = parseGender(data.content.gender);
                setGender(parsedGender.gender);
                if (parsedGender.customValue) {
                    setCustomGender(parsedGender.customValue);
                }
                setIsNsfw(data.content.nsfw === 'true' || data.content.nsfw === true);
            }
        } catch (error) {
            console.error('Error generating character:', error);
            setError('Failed to generate character. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    }

    const generateAvatar = async () => {
        if (isGeneratingAvatar) return;

        setIsGeneratingAvatar(true);
        setError(null);

        try {
            // Get the current character data
            const characterData = {
                name: name,
                gender: gender === Gender.CUSTOM ? customGender : gender,
                description: description,
                bio: bio,
                nsfw: isNsfw
            };

            const { data } = await api.post(endpoints.characters.generateAvatar, characterData);

            if (data.success && data.content?.imageUrl) {
                // Store the URL directly - don't convert to File
                setAvatarFile(data.content.imageUrl);
            } else {
                setError('Failed to generate avatar');
            }
        } catch (error) {
            console.error('Error generating avatar:', error);
            setError('Failed to generate avatar. Please try again.');
        } finally {
            setIsGeneratingAvatar(false);
            close();
        }
    };

    const generateBanner = async () => {
        if (isGeneratingBanner) return;

        setIsGeneratingBanner(true);
        setError(null);

        try {
            // Get the current character data
            const characterData = {
                name: name,
                gender: gender === Gender.CUSTOM ? customGender : gender,
                description: description,
                bio: bio,
                nsfw: isNsfw
            };

            const { data } = await api.post(endpoints.characters.generateBanner, characterData);

            if (data.success && data.content?.imageUrl) {
                // Store the URL directly - don't convert to File
                setBannerFile(data.content.imageUrl);
            } else {
                setError('Failed to generate banner');
            }
        } catch (error) {
            console.error('Error generating banner:', error);
            setError('Failed to generate banner. Please try again.');
        } finally {
            setIsGeneratingBanner(false);
            close();
        }
    };

    return (
        <form onSubmit={handleCreateCharacter}>
            <div>
                <div className="relative w-full mb-4">
                    <div className="relative w-full aspect-[3/1]">
                        <SelectImage
                            src={bannerPreviewUrl}
                            alt="Character banner"
                            fill
                            className="object-contain"
                            onFileSelected={setBannerFile}
                            disabled={isSubmitting || isGenerating}
                        />
                    </div>
                    <div className="absolute bottom-2 right-2" ref={dropdownRef}>
                        <CircleActionButton
                            onClick={toggle}
                            icon={GenerateIcon}
                            className="text-zinc-400 hover:text-white"
                            disabled={isSubmitting || isGenerating}
                        />
                        {isOpen && (
                            <Dropdown className="w-50">
                                <DropdownItem
                                    onClick={generateAvatar}
                                    className={isGeneratingAvatar ? "opacity-50 cursor-not-allowed" : ""}
                                >
                                    {isGeneratingAvatar ? 'Generating...' : 'Generate Avatar'}
                                </DropdownItem>
                                <DropdownItem
                                    onClick={generateBanner}
                                    className={isGeneratingBanner ? "opacity-50 cursor-not-allowed" : ""}
                                >
                                    {isGeneratingBanner ? 'Generating...' : 'Generate Banner'}
                                </DropdownItem>
                            </Dropdown>
                        )}
                    </div>
                    <div
                        className="absolute left-4 bottom-0 translate-y-1/2 w-[25%] max-w-[150px] min-w-[80px] aspect-square rounded-full border-4 border-black overflow-hidden pointer-events-auto"
                    >
                        <SelectImage
                            src={avatarPreviewUrl}
                            alt="Character avatar"
                            fill
                            className="rounded-full object-cover"
                            onFileSelected={setAvatarFile}
                            disabled={isSubmitting || isGenerating}
                        />
                    </div>
                </div>
                {error && (
                    <div className="text-red-500 text-sm text-center mb-2">{error}</div>
                )}
                <div className="flex justify-end space-x-2 items-center pr-4">
                    <CircleActionButton
                        onClick={() => {
                            if (!isSubmitting && !isGenerating) {
                                const randomTags = getRandomWords(10);
                                setTags(randomTags.join(', '));
                            }
                        }}
                        icon={DiceIcon}
                        className="border border-zinc-600 hover:bg-zinc-600"
                        disabled={isSubmitting || isGenerating}
                    />
                    <textarea
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        disabled={isSubmitting || isGenerating}
                        rows={2}
                        className="w-[55%] bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50"
                        placeholder={`Generate character from tags\n(e.g. 'cat, magic, funny')`}
                    />
                    <CircleActionButton
                        onClick={generateCharacter}
                        icon={isGenerating ? LoadingSpinner : RightArrowIcon}
                        className="border border-zinc-600 hover:bg-zinc-600"
                        disabled={isSubmitting || isGenerating}
                    />
                </div>
            </div>
            <div className="p-4 flex flex-col space-y-4">
                <div className="flex items-center">
                    <label htmlFor="name" className="pl-2 w-[15%] text-sm font-medium text-zinc-200">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting || isGenerating}
                        className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50"
                        placeholder="Character name"
                    />
                </div>
                <div className="flex items-center">
                    <label htmlFor="path" className="pl-2 w-[15%] text-sm font-medium text-zinc-200">Path</label>
                    <input
                        type="text"
                        id="path"
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                        required
                        disabled={isSubmitting || isGenerating}
                        className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50"
                        placeholder="url-friendly-path"
                    />
                </div>
                <div className="flex items-center">
                    <label htmlFor="gender" className="pl-2 w-[15%] text-sm font-medium text-zinc-200">Gender</label>
                    <div className="flex w-full space-x-2">
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value as Gender)}
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
                                onChange={(e) => setCustomGender(e.target.value)}
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
                        onChange={(e) => setBio(e.target.value)}
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
                            setDescription(e.target.value);
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
                <div className="flex items-center justify-center space-x-12">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="public"
                            checked={isPublic}
                            onCheckedChange={(checked) => {
                                if (!isSubmitting && !isGenerating) {
                                    setIsPublic(checked);
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
                                    setIsNsfw(checked);
                                }
                            }}
                            className={(isSubmitting || isGenerating) ? "opacity-50 cursor-not-allowed" : ""}
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