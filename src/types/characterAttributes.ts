export type CharacterAttributesSchema = {
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

export type CharacterAttributes = Omit<CharacterAttributesSchema, 'character_id'>;

export type AttributeMetadata = {
    name: string;
    description: string;
    category: 'state' | 'actions' | 'providers' | 'evaluators' | 'content';
}

export const attributeMetadata: Record<keyof CharacterAttributes, AttributeMetadata> = {
    mood: {
        name: "Mood",
        description: "Your characters current mood",
        category: 'state'
    },
    goal: {
        name: "Goal",
        description: "Your characters current goal",
        category: 'state'
    },
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
    },
    readingScope: {
        name: "Reading Scope",
        description: "How broadly your character reads and considers content across the platform",
        category: 'providers'
    },
    informationFiltering: {
        name: "Information Filtering",
        description: "How selectively your character filters and processes information",
        category: 'providers'
    },
    sentimentFiltering: {
        name: "Sentiment Filtering",
        description: "How much your character filters content based on emotional tone",
        category: 'providers'
    },
    profileScrutiny: {
        name: "Profile Scrutiny",
        description: "How deeply your character examines other users' profiles",
        category: 'providers'
    },
    influencability: {
        name: "Influencability",
        description: "How easily your character is influenced by others' opinions and behaviors",
        category: 'evaluators'
    },
    engagementSensitivity: {
        name: "Engagement Sensitivity",
        description: "How sensitive your character is to engagement metrics",
        category: 'evaluators'
    },
    relationshipFormationSpeed: {
        name: "Relationship Formation Speed",
        description: "How quickly your character forms relationships with others",
        category: 'evaluators'
    },
    relationshipClosenessThreshold: {
        name: "Relationship Closeness Threshold",
        description: "How much interaction is needed before your character considers someone close",
        category: 'evaluators'
    },
    relationshipStability: {
        name: "Relationship Stability",
        description: "How stable your character's relationships are once formed",
        category: 'evaluators'
    },
    grudgePersistence: {
        name: "Grudge Persistence",
        description: "How long your character maintains negative feelings from conflicts",
        category: 'evaluators'
    },
    positivity: {
        name: "Positivity",
        description: "How positive or optimistic your character's interactions are",
        category: 'content'
    },
    openness: {
        name: "Openness",
        description: "How willing your character is to share personal thoughts and feelings",
        category: 'content'
    },
    formality: {
        name: "Formality",
        description: "How formal or casual your character's communication style is",
        category: 'content'
    },
    conflictInitiation: {
        name: "Conflict Initiation",
        description: "How likely your character is to initiate or engage in conflicts",
        category: 'content'
    },
    influenceSeeking: {
        name: "Influence Seeking",
        description: "How actively your character seeks to influence others",
        category: 'content'
    },
    inquisitiveness: {
        name: "Inquisitiveness",
        description: "How often your character asks questions and seeks information",
        category: 'content'
    },
    humor: {
        name: "Humor",
        description: "How often your character uses humor in interactions",
        category: 'content'
    },
    depth: {
        name: "Depth",
        description: "How deep or superficial your character's interactions tend to be",
        category: 'content'
    }
};