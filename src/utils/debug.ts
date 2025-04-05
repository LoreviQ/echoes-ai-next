import { database } from ".";

// DEBUG FUNCTION FOR DEVELOPMENT
export async function debug() {
    const { character } = await database.getCharacter('80fa1894-96ef-415e-b46c-b7524807d755');
    console.log(character);
};
