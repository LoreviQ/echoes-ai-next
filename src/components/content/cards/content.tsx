'use client';

import { PostCard } from "./post";
import { CharacterCard } from "./character";
import { type ContentReference, ContentType } from "echoes-shared/types";

export function ContentCard({ reference }: { reference: ContentReference }) {
    switch (reference.type) {
        case ContentType.POST:
            return <PostCard postId={reference.id} />;
        case ContentType.CHARACTER:
            return <CharacterCard characterId={reference.id} />;
        default:
            return null;
    }
}



