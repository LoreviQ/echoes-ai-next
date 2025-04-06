import { ChangeEvent, useState } from 'react';
import { UserPersonasSchema, UserPersonas } from '@/types';
import { PenSquareIcon, CheckSquareIcon } from '@/assets/icons';

interface PersonaCardProps {
    persona: UserPersonasSchema | (UserPersonas & { temp_id: string });
    onUpdate: (id: string, updates: Partial<UserPersonas>) => void;
    onDelete: (id: string) => void;
    isNew?: boolean;
}

interface PersonaDisplayProps {
    persona: UserPersonasSchema | (UserPersonas & { temp_id: string });
}

interface PersonaEditProps extends PersonaDisplayProps {
    id: string;
    onUpdate: (id: string, updates: Partial<UserPersonas>) => void;
}

function ReadPersona({ persona }: PersonaDisplayProps) {
    return (
        <div>
            <h3 className="text-lg font-medium">{persona.name || 'Unnamed Persona'}</h3>
            {persona.gender && <p className="text-sm text-gray-500 mt-1">Gender: {persona.gender}</p>}
            {persona.bio && <p className="text-sm mt-2">{persona.bio}</p>}
            {persona.appearance && (
                <div className="mt-2">
                    <h4 className="text-sm font-medium">Appearance</h4>
                    <p className="text-sm text-gray-600">{persona.appearance}</p>
                </div>
            )}
            {persona.description && (
                <div className="mt-2">
                    <h4 className="text-sm font-medium">Description</h4>
                    <p className="text-sm text-gray-600">{persona.description}</p>
                </div>
            )}
            {persona.avatar_url && (
                <div className="mt-2">
                    <h4 className="text-sm font-medium">Avatar URL</h4>
                    <p className="text-sm text-gray-600 truncate">{persona.avatar_url}</p>
                </div>
            )}
            {persona.banner_url && (
                <div className="mt-2">
                    <h4 className="text-sm font-medium">Banner URL</h4>
                    <p className="text-sm text-gray-600 truncate">{persona.banner_url}</p>
                </div>
            )}
        </div>
    );
}

function EditPersona({ persona, id, onUpdate }: PersonaEditProps) {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onUpdate(id, { [name]: value });
    };

    return (
        <div className="space-y-3">
            <div>
                <label htmlFor={`name-${id}`} className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    id={`name-${id}`}
                    name="name"
                    type="text"
                    value={persona.name || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor={`gender-${id}`} className="block text-sm font-medium text-gray-700">Gender</label>
                <input
                    id={`gender-${id}`}
                    name="gender"
                    type="text"
                    value={persona.gender || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor={`bio-${id}`} className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                    id={`bio-${id}`}
                    name="bio"
                    rows={2}
                    value={persona.bio || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor={`appearance-${id}`} className="block text-sm font-medium text-gray-700">Appearance</label>
                <textarea
                    id={`appearance-${id}`}
                    name="appearance"
                    rows={2}
                    value={persona.appearance || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor={`description-${id}`} className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id={`description-${id}`}
                    name="description"
                    rows={2}
                    value={persona.description || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor={`avatar_url-${id}`} className="block text-sm font-medium text-gray-700">Avatar URL</label>
                <input
                    id={`avatar_url-${id}`}
                    name="avatar_url"
                    type="text"
                    value={persona.avatar_url || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor={`banner_url-${id}`} className="block text-sm font-medium text-gray-700">Banner URL</label>
                <input
                    id={`banner_url-${id}`}
                    name="banner_url"
                    type="text"
                    value={persona.banner_url || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
            </div>
        </div>
    );
}

export function PersonaCard({ persona, onUpdate, onDelete, isNew = false }: PersonaCardProps) {
    const [isEditing, setIsEditing] = useState(isNew);
    const id = 'id' in persona ? persona.id : persona.temp_id;

    return (
        <div className="relative border border-gray-200 rounded-lg p-4 mb-4">
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

            {isEditing ? (
                <EditPersona persona={persona} id={id} onUpdate={onUpdate} />
            ) : (
                <ReadPersona persona={persona} />
            )}
        </div>
    );
} 