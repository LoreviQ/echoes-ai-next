import { createClient } from '@/utils/supabase.server';
import { notFound } from 'next/navigation';
import ClickableImage from '@/components/ClickableImage';

export default async function CharacterPage(
    props: {
        params: Promise<{ path: string }>;
    }
) {
    const params = await props.params;
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
        <main className="flex flex-col">
            <div className="relative w-full max-w-[600px]">
                <div className="relative w-full aspect-[3/1]">
                    <ClickableImage
                        src="/images/banner-placeholder.jpg"
                        alt="Character banner placeholder"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="absolute bottom-0 translate-y-1/2 left-4">
                    <div className="relative w-[150px] h-[150px] rounded-full border-4 border-black">
                        <ClickableImage
                            src="/images/avatar-placeholder.jpg"
                            alt="Character avatar"
                            fill
                            className="rounded-full object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </main>
    );
} 