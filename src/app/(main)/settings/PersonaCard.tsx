import { ChangeEvent, useState } from 'react';
import { UserPersonasSchema, UserPersonas } from '@/types';
import { PenSquareIcon, CheckSquareIcon } from '@/assets/icons';
import { UserIdentity } from '@/components/ui';
import { Gender } from '@/types';


interface PersonaCardProps {
    persona: UserPersonasSchema | (UserPersonas & { temp_id: string });
    onUpdate: (id: string, updates: Partial<UserPersonas>) => void;
    onDelete: (id: string) => void;
    isNew?: boolean;
}

export function PersonaCard({ persona, onUpdate, onDelete, isNew = false }: PersonaCardProps) {
    const [isEditing, setIsEditing] = useState(isNew);
    const [isExpanded, setIsExpanded] = useState(false);
    const id = 'id' in persona ? persona.id : persona.temp_id;

    return (
        <div className="relative border border-gray-200 rounded-lg">
            {/* Edit/Save toggle button */}
            <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="absolute top-2 right-12 text-gray-500 hover:text-gray-700"
                aria-label={isEditing ? "Save" : "Edit"}
            >
                {isEditing
                    ? <CheckSquareIcon className="w-5 h-5" />
                    : <PenSquareIcon className="w-5 h-5" />}
            </button>

            {/* Delete button */}
            <button
                type="button"
                onClick={() => onDelete(id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                aria-label="Delete persona"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
            <PersonaDetails persona={persona} isExpanded={isExpanded} setIsExpanded={setIsExpanded} isEditing={isEditing} id={id} onUpdate={onUpdate} />
        </div>
    );
}

interface PersonaDetailsProps {
    persona: UserPersonasSchema | (UserPersonas & { temp_id: string });
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
    isEditing: boolean;
    id: string;
    onUpdate: (id: string, updates: Partial<UserPersonas>) => void;
}

function PersonaDetails({ persona, isExpanded, setIsExpanded, isEditing, id, onUpdate }: PersonaDetailsProps) {
    const [customGenderText, setCustomGenderText] = useState<string>(
        persona.gender && !Object.values(Gender).includes(persona.gender as Gender)
            ? persona.gender
            : ''
    );

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        onUpdate(id, { [name]: value });
    };

    const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as Gender;

        if (value === Gender.CUSTOM) {
            // Just set the gender to Custom initially
            onUpdate(id, { gender: value });
        } else {
            // For standard genders, just use the enum value
            onUpdate(id, { gender: value });
            // Reset custom gender when switching back to standard gender
            setCustomGenderText('');
        }
    };

    const handleCustomGenderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomGenderText(value);

        // When typing in the custom field, update the gender field directly with the text
        // This is what will be sent to the database
        onUpdate(id, { gender: value });
    };

    // Determine what to display in the dropdown
    const displayGender = persona.gender && Object.values(Gender).includes(persona.gender as Gender)
        ? persona.gender
        : persona.gender
            ? Gender.CUSTOM  // If it's a string but not a standard enum value, show as Custom
            : '';

    // Determine if we should show the custom input
    const showCustomInput = displayGender === Gender.CUSTOM;

    return (
        <>
            <div className="p-4" onClick={() => setIsExpanded(!isExpanded)}>
                <UserIdentity persona={persona} editable={isEditing} />
            </div>
            {isExpanded && (
                <div className="p-4 space-y-4">
                    <div className="flex items-center">
                        <label htmlFor="name" className="pl-2 w-[15%] text-sm font-medium text-zinc-200">Name</label>
                        <input
                            id={`name-${id}`}
                            name="name"
                            type="text"
                            value={persona.name || ''}
                            onChange={handleInputChange}
                            className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50"
                            disabled={!isEditing}
                            placeholder="Persona name"
                        />
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="gender" className="pl-2 w-[15%] text-sm font-medium text-zinc-200">Gender</label>
                        <div className="flex w-full space-x-2">
                            <select
                                id="gender"
                                name="gender"
                                value={displayGender}
                                onChange={handleGenderChange}
                                disabled={!isEditing}
                                className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50"
                            >
                                {Object.values(Gender).map((genderValue) => (
                                    <option key={genderValue} value={genderValue}>
                                        {genderValue}
                                    </option>
                                ))}
                            </select>
                            {showCustomInput && (
                                <input
                                    type="text"
                                    name="customGenderText"
                                    value={customGenderText}
                                    onChange={handleCustomGenderChange}
                                    disabled={!isEditing}
                                    className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50"
                                    placeholder="Enter custom gender"
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center px-2 space-x-2">
                            <label htmlFor="bio" className="text-sm font-medium text-zinc-200">Bio</label>
                            <span className="text-xs text-zinc-400">Your Persona's public profile</span>
                        </div>
                        <textarea
                            id="bio"
                            name="bio"
                            value={persona.bio || ''}
                            onChange={handleInputChange}
                            rows={3}
                            maxLength={200}
                            disabled={!isEditing}
                            className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50 resize-none"
                            placeholder="Enter character bio (optional)"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center px-2 space-x-2">
                            <label htmlFor="description" className="text-sm font-medium text-zinc-200">Description</label>
                            <span className="text-xs text-zinc-400">Information characters will 'figure out' when interacting with you</span>
                        </div>
                        <textarea
                            id="description"
                            name="description"
                            value={persona.description || ''}
                            onChange={handleInputChange}
                            rows={3}
                            disabled={!isEditing}
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
                            name="appearance"
                            value={persona.appearance || ''}
                            onChange={handleInputChange}
                            rows={3}
                            disabled={!isEditing}
                            className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 disabled:opacity-50 min-h-[72px] overflow-hidden"
                            placeholder="Enter character appearance (optional)"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
