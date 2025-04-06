import { Character } from "@/types";
import { Identity } from "./genericDisplay";

export function CharacterIdentity({ character }: { character: Character }) {
    return (
        <Identity
            name={character.name}
            path={character.path}
            avatar_url={character.avatar_url}
        />
    )
}

