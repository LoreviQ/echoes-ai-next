import { BackHeader } from '@/components/ui/BackHeader';
import React from 'react';
import { CharacterRecommendationFeed } from '@/components/ui/Feed';

export default function CharactersPage() {
    return (
        <div>
            <BackHeader text="Characters" />
            <CharacterRecommendationFeed />
        </div>
    );
}