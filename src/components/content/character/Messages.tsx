'use client';

import React from 'react';
import { useMessagesContent } from '@/hooks/useMessagesContent';

export function MessagesContent() {
    const { content } = useMessagesContent();

    if (!content) {
        return null;
    }

    return content;
}

