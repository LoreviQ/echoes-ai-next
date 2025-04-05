import { useSubscribe, useSubscriptions, useUnsubscribe } from "@/hooks/reactQuery";
import { UseMutationResult } from "@tanstack/react-query";

interface SubscriptionButtonProps {
    characterId: string;
}

export function SubscriptionButton({ characterId }: SubscriptionButtonProps) {
    const { data: subscribedCharacterIds } = useSubscriptions();
    const { mutate: subscribe, isPending: isSubscribing } = useSubscribe() as UseMutationResult<string, Error, string>;
    const { mutate: unsubscribe, isPending: isUnsubscribing } = useUnsubscribe() as UseMutationResult<string, Error, string>;

    const isSubscribed = subscribedCharacterIds?.some(sub => sub.character_id === characterId) ?? false;
    const isLoading = isSubscribing || isUnsubscribing;

    const handleSubscriptionClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isLoading) return;

        if (isSubscribed) {
            unsubscribe(characterId);
        } else {
            subscribe(characterId);
        }
    };

    return (
        <button
            onClick={handleSubscriptionClick}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-1 rounded-full transition-colors ${isSubscribed
                ? 'bg-black text-white border border-white hover:bg-zinc-900'
                : 'bg-white text-black hover:bg-zinc-200'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span className="font-bold">
                {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </span>
        </button>
    );
} 