import { GoogleGenAI  } from "@google/genai";

  
const apiKey =import.meta.env.VITE_GOOGLE_AI_API_KEY;
const ai = new GoogleGenAI ({ apiKey });

const generationConfig = {
  temperature: 0.6,
  topP: 0.75,
  topK: 50,
  maxOutputTokens: 2500,
  responseMimeType: "application/json",
};

export const AIChatSession = ai.chats.create({
  model: "gemini-2.5-flash",
  config: generationConfig,
  history: [

  ]
});