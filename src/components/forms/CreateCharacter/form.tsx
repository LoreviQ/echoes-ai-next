'use client';

import React, { useEffect, useReducer } from 'react';
import { useRouter } from 'next/navigation';

import { PROTECTED_ROUTES } from '@/config';
import { uploadImage, database } from '@/utils';
import { queryHook } from '@/hooks';
import { SubmitButton } from '@/components/buttons';
import { Gender } from '@/types';

import { CharacterHero } from './heroComponent';
import { DetailsSection } from './detailsComponent';
import { AdvancedSettings } from './advancedSettingsComponent';
import { formReducer, initialFormState } from './reducer';

// Define form props
export interface CreateCharacterFormProps {
    modal?: boolean;
    onSuccess?: () => void;
}

export default function CreateCharacterForm({ onSuccess, modal = false }: CreateCharacterFormProps) {
    const router = useRouter();
    const { invalidateCharacters } = queryHook.useCharactersInvalidation();
    const [state, dispatch] = useReducer(formReducer, initialFormState);

    // Extract values from state for easier access
    const {
        name, path, bio, description, appearance, gender, customGender,
        isPublic, isNsfw, error, isSubmitting, tags,
        avatarFile, bannerFile
    } = state;

    // Create file URLs for preview
    useEffect(() => {
        if (avatarFile && avatarFile instanceof File) {
            const objectUrl = URL.createObjectURL(avatarFile);
            dispatch({ type: 'SET_FIELD', field: 'avatarPreviewUrl', value: objectUrl });

            // Clean up URL when component unmounts or file changes
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [avatarFile]);

    useEffect(() => {
        if (bannerFile && bannerFile instanceof File) {
            const objectUrl = URL.createObjectURL(bannerFile);
            dispatch({ type: 'SET_FIELD', field: 'bannerPreviewUrl', value: objectUrl });

            // Clean up URL when component unmounts or file changes
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [bannerFile]);

    const validateForm = (): boolean => {
        // Validate path format
        const pathRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
        if (!pathRegex.test(path)) {
            dispatch({
                type: 'SET_ERROR',
                error: 'Path must start and end with a letter or number, and can only contain lowercase letters, numbers, and hyphens'
            });
            return false;
        }

        // Check path length
        if (path.length < 1 || path.length > 255) {
            dispatch({
                type: 'SET_ERROR',
                error: 'Path must be between 1 and 255 characters'
            });
            return false;
        }

        // Check for protected routes
        if (PROTECTED_ROUTES.includes(path as any)) {
            dispatch({
                type: 'SET_ERROR',
                error: 'This path name is reserved. Please choose a different name.'
            });
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

        dispatch({ type: 'RESET_ERROR' });

        if (!validateForm()) {
            return;
        }

        dispatch({ type: 'START_SUBMIT' });

        try {
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

            const { error: insertError } = await database.insertCharacter({
                name,
                path,
                bio: bio || null,
                description: description || null,
                appearance: appearance || null,
                public: isPublic,
                nsfw: isNsfw,
                avatar_url: avatarUrl,
                banner_url: bannerUrl,
                tags,
                gender: gender === Gender.CUSTOM ? customGender : gender,
            });

            if (insertError) {
                console.error('Error creating character:', insertError);
                throw insertError;
            }

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
            dispatch({ type: 'SET_ERROR', error: 'Failed to create character. Please try again.' });
        } finally {
            dispatch({ type: 'END_SUBMIT' });
        }
    };

    return (
        <form onSubmit={handleCreateCharacter}>
            <CharacterHero
                state={state}
                dispatch={dispatch}
            />

            <DetailsSection
                state={state}
                dispatch={dispatch}
            />

            <AdvancedSettings
                state={state}
                dispatch={dispatch}
            />

            <div className="flex justify-end px-4">
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