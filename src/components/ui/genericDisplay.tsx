import Link from "next/link";
import { PreviewImage } from "@/components/images";


interface IdentityProps {
    name: string;
    path?: string | null;
    avatar_url: string | null;
}
export function Identity({ name, path = null, avatar_url }: IdentityProps) {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center justify-center w-full sm:w-auto">
                <div className="w-10 h-10 relative">
                    <PreviewImage
                        src={avatar_url || '/default-avatar.png'}
                        alt={`${name}'s avatar`}
                        fill
                        className="rounded-full object-cover"
                    />
                </div>
            </div>
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                <span className="font-bold text-lg">{name}</span>
                {path && (
                    <Link href={`/${path}`} className="text-sm text-zinc-400 hover:underline">
                        @{path}
                    </Link>
                )}
            </div>
        </div>
    )
}