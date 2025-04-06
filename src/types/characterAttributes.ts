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

export type ValueRange = {
    threshold: number;
    description: string;
}

export type AttributeMetadata = {
    name: string;
    description: string;
    category: 'state' | 'actions' | 'providers' | 'evaluators' | 'content';
    valueRanges?: ValueRange[];
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
        category: 'actions',
        valueRanges: [
            { threshold: -100, description: "Rarely posts" },
            { threshold: -60, description: "Infrequently posts" },
            { threshold: -20, description: "Posts an average amount" },
            { threshold: 20, description: "Frequently posts" },
            { threshold: 60, description: "Posts very often" }
        ]
    },
    originality: {
        name: "Originality",
        description: "How often your character decides to create original content vs interacting with existing content",
        category: 'actions',
        valueRanges: [
            { threshold: -100, description: "Almost always interacts with existing content" },
            { threshold: -60, description: "Prefers interacting with existing content" },
            { threshold: -20, description: "Balanced between original and interactive content" },
            { threshold: 20, description: "Prefers creating original content" },
            { threshold: 60, description: "Almost always creates original content" }
        ]
    },
    like_reply_ratio: {
        name: "Like/Reply Ratio",
        description: "When interacting, the frequency of replies vs likes as interactions",
        category: 'actions',
        valueRanges: [
            { threshold: -100, description: "Almost exclusively likes content" },
            { threshold: -60, description: "Prefers liking over replying" },
            { threshold: -20, description: "Balanced between likes and replies" },
            { threshold: 20, description: "Prefers replying over liking" },
            { threshold: 60, description: "Almost exclusively replies to content" }
        ]
    },
    responsiveness: {
        name: "Responsiveness",
        description: "How quickly your character responds to direct messages",
        category: 'actions',
        valueRanges: [
            { threshold: -100, description: "Very slow to respond" },
            { threshold: -60, description: "Takes time to respond" },
            { threshold: -20, description: "Responds at a moderate pace" },
            { threshold: 20, description: "Quick to respond" },
            { threshold: 60, description: "Responds almost immediately" }
        ]
    },
    reading_scope: {
        name: "Reading Scope",
        description: "How broadly your character reads and considers content across the platform",
        category: 'providers',
        valueRanges: [
            { threshold: -100, description: "Reads very few if any posts" },
            { threshold: -60, description: "Reads a few posts" },
            { threshold: -20, description: "Reads a moderate amount of posts" },
            { threshold: 20, description: "Reads a lot of posts" },
            { threshold: 60, description: "Reads an overwhelming amount of posts" }
        ]
    },
    information_filtering: {
        name: "Information Filtering",
        description: "How selectively your character filters and processes information",
        category: 'providers',
        valueRanges: [
            { threshold: -100, description: "Extremely focused on specific topics" },
            { threshold: -60, description: "Tends to stay within familiar topics" },
            { threshold: -20, description: "Balanced reading scope" },
            { threshold: 20, description: "Explores diverse topics" },
            { threshold: 60, description: "Does not filter based on topic" }
        ]
    },
    sentiment_filtering: {
        name: "Sentiment Filtering",
        description: "How much your character filters content based on emotional tone",
        category: 'providers',
        valueRanges: [
            { threshold: -100, description: "Ignores emotional tone completely" },
            { threshold: -60, description: "Rarely considers emotional tone" },
            { threshold: -20, description: "Sometimes considers emotional tone" },
            { threshold: 20, description: "Often filters by emotional tone" },
            { threshold: 60, description: "Heavily filters based on emotional tone" }
        ]
    },
    profile_scrutiny: {
        name: "Profile Scrutiny",
        description: "How deeply your character examines other profiles",
        category: 'providers',
        valueRanges: [
            { threshold: -100, description: "Never checks profiles" },
            { threshold: -60, description: "Rarely checks profiles" },
            { threshold: -20, description: "Sometimes checks profiles" },
            { threshold: 20, description: "Often checks profiles" },
            { threshold: 60, description: "Always thoroughly examines profiles" }
        ]
    },
    influencability: {
        name: "Influencability",
        description: "How easily your character is influenced by others' opinions and behaviors",
        category: 'evaluators',
        valueRanges: [
            { threshold: -100, description: "Completely resistant to influence" },
            { threshold: -60, description: "Rarely influenced by others" },
            { threshold: -20, description: "Moderately influenced by others" },
            { threshold: 20, description: "Easily influenced by others" },
            { threshold: 60, description: "Extremely susceptible to influence" }
        ]
    },
    engagement_sensitivity: {
        name: "Engagement Sensitivity",
        description: "How sensitive your character is to engagement metrics",
        category: 'evaluators',
        valueRanges: [
            { threshold: -100, description: "Completely ignores engagement metrics" },
            { threshold: -60, description: "Barely notices engagement metrics" },
            { threshold: -20, description: "Moderately aware of engagement" },
            { threshold: 20, description: "Quite sensitive to engagement" },
            { threshold: 60, description: "Extremely focused on engagement metrics" }
        ]
    },
    relationship_formation_speed: {
        name: "Relationship Formation Speed",
        description: "How quickly your character forms relationships with others",
        category: 'evaluators',
        valueRanges: [
            { threshold: -100, description: "Very slow to form relationships" },
            { threshold: -60, description: "Takes time to form relationships" },
            { threshold: -20, description: "Forms relationships at a normal pace" },
            { threshold: 20, description: "Quick to form relationships" },
            { threshold: 60, description: "Forms relationships very quickly" }
        ]
    },
    relationship_closeness_threshold: {
        name: "Relationship Closeness Threshold",
        description: "How much interaction is needed before your character considers someone close",
        category: 'evaluators',
        valueRanges: [
            { threshold: -100, description: "Very difficult to become close with" },
            { threshold: -60, description: "High threshold for closeness" },
            { threshold: -20, description: "Moderate threshold for closeness" },
            { threshold: 20, description: "Relatively low threshold for closeness" },
            { threshold: 60, description: "Very easily considers others close" }
        ]
    },
    relationship_stability: {
        name: "Relationship Stability",
        description: "How stable your character's relationships are once formed",
        category: 'evaluators',
        valueRanges: [
            { threshold: -100, description: "Very unstable relationships" },
            { threshold: -60, description: "Somewhat unstable relationships" },
            { threshold: -20, description: "Moderately stable relationships" },
            { threshold: 20, description: "Quite stable relationships" },
            { threshold: 60, description: "Extremely stable relationships" }
        ]
    },
    grudge_persistence: {
        name: "Grudge Persistence",
        description: "How long your character maintains negative feelings from conflicts",
        category: 'evaluators',
        valueRanges: [
            { threshold: -100, description: "Never holds grudges" },
            { threshold: -60, description: "Quickly forgives" },
            { threshold: -20, description: "Sometimes holds grudges" },
            { threshold: 20, description: "Often holds grudges" },
            { threshold: 60, description: "Always holds long-lasting grudges" }
        ]
    },
    positivity: {
        name: "Positivity",
        description: "How positive or optimistic your character's interactions are",
        category: 'content',
        valueRanges: [
            { threshold: -100, description: "Extremely negative outlook" },
            { threshold: -60, description: "Generally pessimistic" },
            { threshold: -20, description: "Balanced outlook" },
            { threshold: 20, description: "Generally optimistic" },
            { threshold: 60, description: "Extremely positive outlook" }
        ]
    },
    openness: {
        name: "Openness",
        description: "How willing your character is to share personal thoughts and feelings",
        category: 'content',
        valueRanges: [
            { threshold: -100, description: "Extremely private and guarded" },
            { threshold: -60, description: "Generally reserved" },
            { threshold: -20, description: "Moderately open" },
            { threshold: 20, description: "Quite open and sharing" },
            { threshold: 60, description: "Completely open and transparent" }
        ]
    },
    formality: {
        name: "Formality",
        description: "How formal or casual your character's communication style is",
        category: 'content',
        valueRanges: [
            { threshold: -100, description: "Very casual and informal" },
            { threshold: -60, description: "Mostly casual" },
            { threshold: -20, description: "Mix of formal and casual" },
            { threshold: 20, description: "Generally formal" },
            { threshold: 60, description: "Extremely formal and proper" }
        ]
    },
    conflict_initiation: {
        name: "Conflict Initiation",
        description: "How likely your character is to initiate or engage in conflicts",
        category: 'content',
        valueRanges: [
            { threshold: -100, description: "Always avoids conflict" },
            { threshold: -60, description: "Usually avoids conflict" },
            { threshold: -20, description: "Sometimes engages in conflict" },
            { threshold: 20, description: "Often initiates conflict" },
            { threshold: 60, description: "Actively seeks out conflict" }
        ]
    },
    influence_seeking: {
        name: "Influence Seeking",
        description: "How actively your character seeks to influence others",
        category: 'content',
        valueRanges: [
            { threshold: -100, description: "Never tries to influence others" },
            { threshold: -60, description: "Rarely tries to influence others" },
            { threshold: -20, description: "Sometimes tries to influence others" },
            { threshold: 20, description: "Often tries to influence others" },
            { threshold: 60, description: "Always trying to influence others" }
        ]
    },
    inquisitiveness: {
        name: "Inquisitiveness",
        description: "How often your character asks questions and seeks information",
        category: 'content',
        valueRanges: [
            { threshold: -100, description: "Never asks questions" },
            { threshold: -60, description: "Rarely asks questions" },
            { threshold: -20, description: "Sometimes asks questions" },
            { threshold: 20, description: "Often asks questions" },
            { threshold: 60, description: "Constantly asking questions" }
        ]
    },
    humor: {
        name: "Humor",
        description: "How often your character uses humor in interactions",
        category: 'content',
        valueRanges: [
            { threshold: -100, description: "Never uses humor" },
            { threshold: -60, description: "Rarely uses humor" },
            { threshold: -20, description: "Sometimes uses humor" },
            { threshold: 20, description: "Often uses humor" },
            { threshold: 60, description: "Always trying to be humorous" }
        ]
    },
    depth: {
        name: "Depth",
        description: "How deep or superficial your character's interactions tend to be",
        category: 'content',
        valueRanges: [
            { threshold: -100, description: "Very superficial interactions" },
            { threshold: -60, description: "Generally superficial" },
            { threshold: -20, description: "Mix of deep and superficial" },
            { threshold: 20, description: "Generally deep interactions" },
            { threshold: 60, description: "Always seeks deep meaningful interactions" }
        ]
    }
};

/**
 * Gets the description for a given attribute value by finding the highest threshold
 * that the value meets or exceeds.
 */
export function getAttributeValueDescription(attribute: keyof CharacterAttributes, value: number): string {
    const metadata = attributeMetadata[attribute];
    if (!metadata.valueRanges) return '';

    // Sort by threshold in descending order and find the first threshold that the value meets
    const matchingRange = [...metadata.valueRanges]
        .sort((a, b) => b.threshold - a.threshold)
        .find(range => value >= range.threshold);

    return matchingRange?.description || '';
}