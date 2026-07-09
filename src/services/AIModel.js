import { GoogleGenerativeAI } from "@google/genai";

  
const apiKey =import.meta.env.VITE_GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig = {
  temperature: 0.6,
  topP: 0.75,
  topK: 50,
  maxOutputTokens: 2500,
  responseMimeType: "application/json",
};

export const AIChatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "You are a professional resume writer."
        }
      ]
    },
    {
      role: "model",
      parts: [
        {
          text: "Understood. I'll generate ATS-friendly resumes."
        }
      ]
    }
  ]
});