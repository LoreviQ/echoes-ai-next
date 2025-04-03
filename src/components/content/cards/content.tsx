'use client';

import { ContentItem, ContentType } from "@/types/content";
import { PostCard } from "./post";
import { CharacterCard } from "./character";


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



