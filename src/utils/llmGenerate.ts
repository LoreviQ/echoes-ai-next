import { GoogleGenAI } from "@google/genai";

const gemini_ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const models_to_provider: Record<string, string> = {
    "gemini-2.0-flash": "google",
}

// adapter pattern for different providers and models
export async function generateReponse(prompt: string, model: string = "gemini-2.0-flash", systemInstruction: string = "") {
    switch (models_to_provider[model]) {
        case "google":
            return googleGenerate(prompt, model, systemInstruction);
    }
}

// uses google genai to generate a response
async function googleGenerate(prompt: string, model: string, systemInstruction: string = "") {
    const response = await gemini_ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return response.text;
}