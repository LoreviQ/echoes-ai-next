// Relative url gets redirected to the backend
const API_BASE_URL = '/api';
export const API_VERSION = "v1";
import axios from "axios";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const endpoints = {
    characters: {
        posts: (characterId: string) => `/${API_VERSION}/characters/${characterId}/posts`,
    },
}