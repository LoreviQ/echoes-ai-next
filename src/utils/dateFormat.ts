export function formatPostDate(date: Date): string {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    // If less than 24 hours ago
    if (diffInHours < 24) {
        if (diffInHours < 1) {
            const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
            return `${minutes}m`;
        }
        return `${Math.floor(diffInHours)}h`;
    }

    // If same year
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    // If different year
    return date.toLocaleDateString();
} 