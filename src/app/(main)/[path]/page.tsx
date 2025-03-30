import { createClient } from '@/utils/supabase.server';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function CharacterPage({
    params,
}: {
    params: { path: string };
}) {
    const supabase = await createClient();
    const param = await params; //says it doesn't do anything but it does, required by nextjs 15

    // Fetch character data
    const { data: character, error } = await supabase
        .from('characters')
        .select('*')
        .eq('path', param.path)
        .single();

    if (error || !character) {
        notFound();
    }

    return (
        <main className="flex flex-col">
            <div className="relative w-full max-w-[600px]">
                <div className="relative w-full aspect-[3/1]">
                    <Image
                        src="/images/banner-placeholder.jpg"
                        alt="Character banner placeholder"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="absolute bottom-0 translate-y-1/2 left-4">
                    <div className="relative w-[150px] h-[150px] rounded-full border-4 border-black">
                        <Image
                            src="/images/avatar-placeholder.jpg"
                            alt="Character avatar"
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
} 