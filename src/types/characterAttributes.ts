export type CharacterAttributesSchema = {
    character_id: string;

    // state - changes based on evaluators
    mood: string;
    goal: string;

    // Governs frequency of actions
    posting_frequency: number;
    originality: number;
    like_reply_ratio: number;
    responsiveness: number;

    // Governs the context providers
    reading_scope: number;
    information_filtering: number;
    sentiment_filtering: number;
    profile_scrutiny: number;

    // Governs evaluations of the characters state
    influencability: number;
    engagement_sensitivity: number;
    relationship_formation_speed: number;
    relationship_closeness_threshold: number;
    relationship_stability: number;
    grudge_persistence: number;

    // Governs content of interactions
    positivity: number;
    openness: number;
    formality: number;
    conflict_initiation: number;
    influence_seeking: number;
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
    posting_frequency: {
        name: "Posting Frequency",
        description: "How often your character interacts with the platform",
        category: 'actions'
    },
    originality: {
        name: "Originality",
        description: "How often your character decides to create original content vs interacting with existing content",
        category: 'actions'
    },
    like_reply_ratio: {
        name: "Like/Reply Ratio",
        description: "When interacting, the frequency of replies vs likes as interactions",
        category: 'actions'
    },
    responsiveness: {
        name: "Responsiveness",
        description: "How quickly your character responds to direct messages",
        category: 'actions'
    },
    reading_scope: {
        name: "Reading Scope",
        description: "How broadly your character reads and considers content across the platform",
        category: 'providers'
    },
    information_filtering: {
        name: "Information Filtering",
        description: "How selectively your character filters and processes information",
        category: 'providers'
    },
    sentiment_filtering: {
        name: "Sentiment Filtering",
        description: "How much your character filters content based on emotional tone",
        category: 'providers'
    },
    profile_scrutiny: {
        name: "Profile Scrutiny",
        description: "How deeply your character examines other users' profiles",
        category: 'providers'
    },
    influencability: {
        name: "Influencability",
        description: "How easily your character is influenced by others' opinions and behaviors",
        category: 'evaluators'
    },
    engagement_sensitivity: {
        name: "Engagement Sensitivity",
        description: "How sensitive your character is to engagement metrics",
        category: 'evaluators'
    },
    relationship_formation_speed: {
        name: "Relationship Formation Speed",
        description: "How quickly your character forms relationships with others",
        category: 'evaluators'
    },
    relationship_closeness_threshold: {
        name: "Relationship Closeness Threshold",
        description: "How much interaction is needed before your character considers someone close",
        category: 'evaluators'
    },
    relationship_stability: {
        name: "Relationship Stability",
        description: "How stable your character's relationships are once formed",
        category: 'evaluators'
    },
    grudge_persistence: {
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
    conflict_initiation: {
        name: "Conflict Initiation",
        description: "How likely your character is to initiate or engage in conflicts",
        category: 'content'
    },
    influence_seeking: {
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