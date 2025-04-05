import { ContentReference, ContentType, ContentItem } from '@/types';
import { useCharacter, usePost } from '@/hooks/reactQuery';

/**
 * Hook to fetch a content item by its reference
 */
export function useContentItem(contentRef: ContentReference) {
    const { type, id } = contentRef;

    // Use different hooks based on content type
    if (type === ContentType.POST) {
        return usePostContentItem(id);
    } else if (type === ContentType.CHARACTER) {
        return useCharacterContentItem(id);
    }

    // Default fallback - shouldn't be reached with proper typing
    return {
        data: undefined,
        isLoading: false,
        error: new Error(`Unknown content type: ${type}`)
    };
}

// Internal hook for fetching a post content item
function usePostContentItem(postId: string) {
    const postQuery = usePost(postId);

    return {
        ...postQuery,
        data: postQuery.data ? {
            type: ContentType.POST,
            data: postQuery.data
        } as ContentItem : undefined
    };
}

// Internal hook for fetching a character content item
function useCharacterContentItem(characterId: string) {
    // Use the existing useCharacter hook directly
    const characterQuery = useCharacter(characterId);

    return {
        ...characterQuery,
        data: characterQuery.data ? {
            type: ContentType.CHARACTER,
            data: characterQuery.data
        } as ContentItem : undefined
    };
} 