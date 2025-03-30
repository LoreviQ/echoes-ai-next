"use client";

import React from 'react';
import { SubmitButton } from '@/components/buttons/SubmitButton';

interface CreateCharacterFormProps {
    onSubmit: (data: { name: string; description: string }) => void;
}

export function CreateCharacterForm({ onSubmit }: CreateCharacterFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        onSubmit({
            name: formData.get('name') as string,
            description: formData.get('description') as string,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                    Character Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-black border border-gray-600 rounded-xl py-2 px-4 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors duration-200"
                    placeholder="Enter character name"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    className="w-full bg-black border border-gray-600 rounded-xl py-2 px-4 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors duration-200"
                    placeholder="Enter character description"
                />
            </div>
            <div className="flex justify-end">
                <SubmitButton label="Create Character" />
            </div>
        </form>
    );
} 