// Relative url gets redirected to the backend
const API_BASE_URL = '/api';

/**
 * Makes a POST request to the external API
 */
export async function postToApi(endpoint: string, data: any) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

/**
 * Generates a post for a character
 */
export async function generateCharacterPost(characterId: string) {
    return postToApi(`/characters/${characterId}/posts`, {});
} 