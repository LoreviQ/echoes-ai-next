import { Character } from "@/types";

export function CharacterStatusAlerts({ character, isOwner }: { character: Character, isOwner: boolean }) {
    return (
        <div className="flex items-center space-x-2">
            {isOwner && (
                <div className={`px-2 py-1 rounded text-white text-xs font-bold ${character.public ? 'bg-green-600' : 'bg-yellow-600'}`}>
                    {character.public ? 'PUBLIC' : 'PRIVATE'}
                </div>
            )}
            {character.nsfw && (
                <div className="px-2 py-1 bg-red-600 rounded text-white text-xs font-bold">
                    NSFW
                </div>
            )}
        </div>
    );
}