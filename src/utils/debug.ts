import { api, endpoints } from "./api";

// DEBUG FUNCTION FOR DEVELOPMENT
export async function debug() {
    const { data } = await api.get(endpoints.user.recommendations);
    console.log(data);
};
