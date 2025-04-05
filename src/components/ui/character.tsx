import { Character } from "@/types";
import { PreviewImage } from "../images";
import Link from "next/link";

export function CharacterIdentity({ character }: { character: Character }) {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center justify-center w-full sm:w-auto">
                <div className="w-10 h-10 relative">
                    <PreviewImage
                        src={character.avatar_url || '/default-avatar.png'}
                        alt={`${character.name}'s avatar`}
                        fill
                        className="rounded-full object-cover"
                    />
                </div>
            </div>
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                <span className="font-bold text-lg">{character.name}</span>
                <Link href={`/${character.path}`} className="text-sm text-zinc-400 hover:underline">
                    @{character.path}
                </Link>
            </div>
        </div>
    )
}