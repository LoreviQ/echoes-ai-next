export type Subscription = {
    user_id: string;
    character_id: string;
};

export type UserSubscription = Pick<Subscription, 'character_id'>;