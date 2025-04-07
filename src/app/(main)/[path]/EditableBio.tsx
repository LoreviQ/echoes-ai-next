'use client';

import { Character, UpdateCharacter } from "@/types";
import { MarkdownContent } from "@/components/ui";
import { useState } from "react";
import { PenSquareIcon, CheckSquareIcon } from "@/assets";
import { database } from "@/utils";
import { useCharacters } from "@/hooks/reactQuery/useCharacters";

interface EditableBioProps {
    character: Character;
    isOwner: boolean;
}
export function EditableBio({ character: initialCharacter, isOwner }: EditableBioProps) {
    const [character, setCharacter] = useState(initialCharacter);
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => {
        setIsEditing(!isEditing);
    }

    if (isEditing) {
        return <BioForm character={character} toggleEdit={toggleEdit} setCharacter={setCharacter} />;
    }
    return (
        <Bio character={character} isOwner={isOwner} toggleEdit={toggleEdit} />
    );
}

interface BioProps {
    character: Character;
    isOwner: boolean;
    toggleEdit: () => void;
}
function Bio({ character, isOwner, toggleEdit: onClick }: BioProps) {
    return (
        <div className="px-4 mt-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h1 className="font-bold text-2xl">{character.name}</h1>
                    {isOwner && (
                        <button onClick={onClick} className="text-zinc-500 hover:text-white transition-colors">
                            <PenSquareIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <div className="text-zinc-500">
                    <span>Followers: </span>
                    <span>{character.subscriber_count}</span>
                </div>
            </div>
            <p className="text-zinc-500">@{character.path}</p>
            <div className="py-4 text-white">
                <MarkdownContent
                    content={character.bio || "This character doesn't have a bio yet!"}
                />
            </div>
        </div>
    );
}

interface BioFormProps {
    character: Character;
    toggleEdit: (e: React.FormEvent) => void;
    setCharacter: (character: Character) => void;
}
function BioForm({ character, toggleEdit: onClick, setCharacter }: BioFormProps) {
    const [name, setName] = useState(character.name);
    const [path, setPath] = useState(character.path);
    const [bio, setBio] = useState(character.bio || "");
    const { updateCharacter } = useCharacters();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onClick(e);
        const newCharacter: Character = { ...character, name, path, bio };
        const newBio: UpdateCharacter = { name, path, bio };
        database.updateCharacter(character.id, newBio);
        setCharacter(newCharacter);
        updateCharacter(character.id, newCharacter);
    }

    return (
        <form onSubmit={handleSubmit} className="px-4 mt-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="font-bold text-2xl bg-transparent focus:border-white outline-none field-sizing-content"
                        style={{ width: `${name.length}ch` }}
                    />
                    <button type="submit" className="text-zinc-500 hover:text-white transition-colors">
                        <CheckSquareIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="text-zinc-500">
                    <span>Followers: </span>
                    <span>{character.subscriber_count}</span>
                </div>
            </div>
            <div className="flex items-center text-zinc-500">
                <span>@</span>
                <input
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="bg-transparent focus:border-white outline-none"
                    style={{ width: `${path.length}ch` }}
                />
            </div>
            <div className="py-4 text-white">
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full min-h-[100px] bg-transparent border border-zinc-700 rounded p-2 focus:border-white outline-none"
                    placeholder="Write your character's bio here..."
                />
            </div>
        </form>
    );
}