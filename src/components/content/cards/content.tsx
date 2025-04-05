'use client';

import { PostCard } from "./post";
import { CharacterCard } from "./character";
import { ContentItem, ContentType } from "@/types";


export function ContentCard({ item }: { item: ContentItem }) {
    switch (item.type) {
        case ContentType.POST:
            return <PostCard post={item.data} />;
        case ContentType.CHARACTER:
            return <CharacterCard character={item.data} />;
        default:
            // TypeScript should prevent this, but adding as a safeguard
            const exhaustiveCheck: never = item;
            return null;
    }
}



