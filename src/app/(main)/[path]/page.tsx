import { createClient } from '@/utils/supabase.server';
import { notFound } from 'next/navigation';

export default async function DynamicPage({
    params,
}: {
    params: { path: string };
}) {
    const supabase = await createClient();

    // Fetch character data
    const { data: character, error } = await supabase
        .from('characters')
        .select('*')
        .eq('path', params.path)
        .single();

    if (error || !character) {
        notFound();
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{character.name}</h1>
            {character.bio && (
                <p className="text-gray-300 mb-4">{character.bio}</p>
            )}
            <div className="text-sm text-gray-400">
                {character.public ? 'Public' : 'Private'} character
                {character.nsfw && ' • NSFW'}
            </div>
        </div>
    );
} 