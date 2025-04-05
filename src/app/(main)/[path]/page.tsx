import { createClient } from '@/utils/supabase.server';
import { notFound } from 'next/navigation';
import { CharacterFeed } from '@/components/ui/Feed';
import { BackHeader } from '@/components/ui/BackHeader';
import { getCharacter } from '@/utils/databaseQueries/characters';
import { CharacterInfo } from './CharacterInfo';
import { CharacterStatusAlerts } from './CharacterStatusAlerts';

export default async function CharacterPage(
    props: {
        params: Promise<{ path: string }>;
    }
) {
    const params = await props.params;
    const supabase = await createClient();

    // Fetch character data
    const { character, error } = await getCharacter(params.path);
    if (error || !character) {
        notFound();
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
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

