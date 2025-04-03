import { Character } from "./character";
import { Post } from "./post";

export enum ContentType {
    POST = "post",
    CHARACTER = "character"
}

export type ContentItem =
    | { type: ContentType.POST; data: Post }
    | { type: ContentType.CHARACTER; data: Character };

// Reference to content without the actual data
export type ContentReference = {
    type: ContentType;
    id: string;
}; 