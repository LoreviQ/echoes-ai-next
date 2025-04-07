import React, { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui';
import { CharacterAttributes, attributeMetadata, getAttributeValueDescription } from '@/types/characterAttributes';
import { SubHeading } from '@/components/forms/formComponents/subheading';

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
                    <AdvancedSettingsForm state={state} dispatch={dispatch} />
                </div>
            )}
        </div>
    );
}

export function AdvancedSettingsForm({ state, dispatch }: AdvancedSettingsProps) {
    const stateAttributes = Object.entries(attributeMetadata)
        .filter(([_, metadata]) => metadata.category === 'state')
        .map(([field]) => field);

    const actionAttributes = Object.entries(attributeMetadata)
        .filter(([_, metadata]) => metadata.category === 'actions')
        .map(([field]) => field);

    const providerAttributes = Object.entries(attributeMetadata)
        .filter(([_, metadata]) => metadata.category === 'providers')
        .map(([field]) => field);

    const evaluatorAttributes = Object.entries(attributeMetadata)
        .filter(([_, metadata]) => metadata.category === 'evaluators')
        .map(([field]) => field);

    const contentAttributes = Object.entries(attributeMetadata)
        .filter(([_, metadata]) => metadata.category === 'content')
        .map(([field]) => field);

    return (
        <div className="space-y-4">
            <SubHeading name="State" description="Your characters current state of mind and goals" />
            {stateAttributes.map((field) => (
                <InputSection
                    key={field}
                    field={field as keyof CharacterAttributes}
                    state={state}
                    dispatch={dispatch}
                />
            ))}

            <SubHeading name="Actions" description="Attributes that determine the actions your character makes" />
            {actionAttributes.map((field) => (
                <SliderSection
                    key={field}
                    field={field as keyof CharacterAttributes}
                    state={state}
                    dispatch={dispatch}
                />
            ))}

            <SubHeading name="Providers" description="Attributes that determine how your character processes information" />
            {providerAttributes.map((field) => (
                <SliderSection
                    key={field}
                    field={field as keyof CharacterAttributes}
                    state={state}
                    dispatch={dispatch}
                />
            ))}

            <SubHeading name="Evaluators" description="Attributes that determine how your character evaluates relationships and interactions" />
            {evaluatorAttributes.map((field) => (
                <SliderSection
                    key={field}
                    field={field as keyof CharacterAttributes}
                    state={state}
                    dispatch={dispatch}
                />
            ))}

            <SubHeading name="Content" description="Attributes that determine the style and content of your character's interactions" />
            {contentAttributes.map((field) => (
                <SliderSection
                    key={field}
                    field={field as keyof CharacterAttributes}
                    state={state}
                    dispatch={dispatch}
                />
            ))}
        </div>
    );
}

function InputSection({ field, state, dispatch }: {
    field: keyof CharacterAttributes,
    state: any,
    dispatch: React.Dispatch<any>,
}) {
    const metadata = attributeMetadata[field];
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_ATTRIBUTE', field: field, value: e.target.value });
    }

    return (
        <div className="flex items-center">
            <label className="pl-2 w-[15%] text-sm font-medium text-zinc-200 cursor-help" title={metadata.description}>{metadata.name}</label>
            <input
                type="text"
                id={field}
                value={state.attributes[field]}
                onChange={onChange}
                required
                disabled={state.isSubmitting || state.isGenerating}
                className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50"
                placeholder={metadata.description}
            />
        </div>
    )
}

function SliderSection({ field, state, dispatch }: {
    field: keyof CharacterAttributes,
    state: any,
    dispatch: React.Dispatch<any>,
}) {
    const metadata = attributeMetadata[field];

    const onChange = (value: number) => {
        dispatch({ type: 'SET_ATTRIBUTE', field: field, value: value });
    }

    return (
        <div className="flex">
            <div className="pl-2 w-[25%] flex flex-col">
                <label className="text-sm font-medium text-zinc-200 cursor-help" title={metadata.description}>{metadata.name}</label>
                <span className="text-xs text-zinc-500">{getAttributeValueDescription(field, state.attributes[field])}</span>
            </div>
            <Slider value={state.attributes[field]} onChange={onChange} disabled={state.isSubmitting || state.isGenerating} />
        </div>
    );
}