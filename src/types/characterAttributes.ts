export type CharacterAttributes = {
    character_id: string;

    // state - changes based on evaluators
    mood: string;
    goal: string;

    // Governs frequency of actions
    postingFrequency: number;
    originality: number;
    likeReplyRatio: number;
    responsiveness: number;

    // Governs the context providers
    readingScope: number;
    informationFiltering: number;
    sentimentFiltering: number;
    profileScrutiny: number;

    // Governs evaluations of the characters state
    influencability: number;
    engagementSensitivity: number;
    relationshipFormationSpeed: number;
    relationshipClosenessThreshold: number;
    relationshipStability: number;
    grudgePersistence: number;

    // Governs content of interactions
    positivity: number;
    openness: number;
    formality: number;
    conflictInitiation: number;
    influenceSeeking: number;
    inquisitiveness: number;
    humor: number;
    depth: number;
}

export type AttributeMetadata = {
    name: string;
    description: string;
    category: 'actions' | 'context' | 'evaluation' | 'interaction';
}

export const attributeMetadata: Record<keyof Pick<CharacterAttributes, 'postingFrequency' | 'originality' | 'likeReplyRatio' | 'responsiveness'>, AttributeMetadata> = {
    postingFrequency: {
        name: "Posting Frequency",
        description: "How often your character interacts with the platform",
        category: 'actions'
    },
    originality: {
        name: "Originality",
        description: "How often your character decides to create original content vs interacting with existing content",
        category: 'actions'
    },
    likeReplyRatio: {
        name: "Like/Reply Ratio",
        description: "When interacting, the frequency of replies vs likes as interactions",
        category: 'actions'
    },
    responsiveness: {
        name: "Responsiveness",
        description: "How quickly your character responds to direct messages",
        category: 'actions'
    }
};