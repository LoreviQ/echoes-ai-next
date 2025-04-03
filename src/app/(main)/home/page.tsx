import { BackHeader } from '@/components/ui/BackHeader';
import React from 'react';
import { HomeFeed } from '@/components/ui/Feed';

export default function HomePage() {
    return (
        <div>
            <BackHeader text="Home" />
            <HomeFeed />
        </div>
    );
}