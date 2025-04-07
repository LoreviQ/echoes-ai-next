import { notFound } from 'next/navigation';

import { createServerClient } from '@/utils/supabase.server';
import { CharacterFeed, BackHeader } from '@/components/ui'
import { CharacterInfo } from './CharacterInfo';
import { CharacterStatusAlerts } from './CharacterStatusAlerts';
import { database } from 'echoes-shared';

export default async function CharacterPage(
    props: {
        params: Promise<{ path: string }>;
    }
) {
    const params = await props.params;
    const supabase = await createServerClient();

    // Fetch character data
    const { character, error } = await database.getCharacterByPath(params.path, supabase);
    if (error || !character) {
        notFound();
    }

    // Get current user
    const { user } = await database.getLoggedInUser(supabase);
    const isOwner = user?.id === character.user_id;

    return (
        <>
            <BackHeader text={character.name} >
                <CharacterStatusAlerts character={character} isOwner={isOwner} />
            </BackHeader>
            <CharacterInfo character={character} isOwner={isOwner} />
            <CharacterFeed character={character} />
        </>
    );
}

