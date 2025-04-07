'use client';

import React from 'react';
import { api, endpoints } from '@/utils';
import { DiceIcon, RightArrowIcon, LoadingSpinner, GenerateIcon } from '@/assets';
import { CircleActionButton } from '@/components/buttons';
import { Dropdown, DropdownItem } from '@/components/ui';
import { SelectImage } from '@/components/images';
import { uiHook } from '@/hooks';
import { Gender } from 'echoes-shared/types';

import { FormState, FormAction } from './reducer';

// Props for the CharacterHero component
interface CharacterHeroProps {
    state: FormState;
    dispatch: React.Dispatch<FormAction>;
}

// Component for the hero section with images and tag generation
export const CharacterHero: React.FC<CharacterHeroProps> = ({
    state,
    dispatch
}) => {
    const { isOpen, toggle, dropdownRef } = uiHook.useDropdown();
    const {
        avatarPreviewUrl, bannerPreviewUrl, tags, isSubmitting, isGenerating,
        isGeneratingAvatar, isGeneratingBanner, error, name, gender, customGender,
        description, bio, isNsfw, appearance
    } = state;

    const generateCharacter = async () => {
        dispatch({ type: 'START_GENERATING' });
        try {
            const { data } = await api.post(endpoints.characters.generate, {
                tags,
            });
            if (data.success && data.content) {
                dispatch({ type: 'GENERATE_CHARACTER_SUCCESS', data: data.content });
            }
        } catch (error) {
            console.error('Error generating character:', error);
            dispatch({ type: 'SET_ERROR', error: 'Failed to generate character. Please try again.' });
        } finally {
            dispatch({ type: 'END_GENERATING' });
        }
    }

    const generateAvatar = async () => {
        if (isGeneratingAvatar) return;

        dispatch({ type: 'START_GENERATING_AVATAR' });

        try {
            // Get the current character data
            const characterData = {
                name,
                gender: gender === Gender.CUSTOM ? customGender : gender,
                description,
                bio,
                nsfw: isNsfw,
                appearance
            };

            const { data } = await api.post(endpoints.characters.generateAvatar, characterData);

            if (data.success && data.content?.imageUrl) {
                // Store the URL directly - don't convert to File
                dispatch({ type: 'SET_AVATAR_FILE', file: data.content.imageUrl });
            } else {
                dispatch({ type: 'SET_ERROR', error: 'Failed to generate avatar' });
            }
        } catch (error) {
            console.error('Error generating avatar:', error);
            dispatch({ type: 'SET_ERROR', error: 'Failed to generate avatar. Please try again.' });
        } finally {
            dispatch({ type: 'END_GENERATING_AVATAR' });
        }
    };

    const generateBanner = async () => {
        if (isGeneratingBanner) return;

        dispatch({ type: 'START_GENERATING_BANNER' });

        try {
            // Get the current character data
            const characterData = {
                name,
                gender: gender === Gender.CUSTOM ? customGender : gender,
                description,
                bio,
                nsfw: isNsfw,
                appearance
            };

            const { data } = await api.post(endpoints.characters.generateBanner, characterData);

            if (data.success && data.content?.imageUrl) {
                // Store the URL directly - don't convert to File
                dispatch({ type: 'SET_BANNER_FILE', file: data.content.imageUrl });
            } else {
                dispatch({ type: 'SET_ERROR', error: 'Failed to generate banner' });
            }
        } catch (error) {
            console.error('Error generating banner:', error);
            dispatch({ type: 'SET_ERROR', error: 'Failed to generate banner. Please try again.' });
        } finally {
            dispatch({ type: 'END_GENERATING_BANNER' });
        }
    };

    return (
        <div>
            <div className="relative w-full mb-4">
                <div className="relative w-full aspect-[3/1]">
                    <SelectImage
                        src={bannerPreviewUrl}
                        alt="Character banner"
                        fill
                        className="object-contain"
                        onFileSelected={(file) => dispatch({ type: 'SET_BANNER_FILE', file })}
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
                        onFileSelected={(file) => dispatch({ type: 'SET_AVATAR_FILE', file })}
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
                            dispatch({ type: 'GENERATE_RANDOM_TAGS' });
                        }
                    }}
                    icon={DiceIcon}
                    className="border border-zinc-600 hover:bg-zinc-600"
                    disabled={isSubmitting || isGenerating}
                />
                <textarea
                    id="tags"
                    value={tags}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'tags', value: e.target.value })}
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
    );
}; 