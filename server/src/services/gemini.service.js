import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SUMMARY_RESPONSE_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      experience_level: {
        type: "string",
        enum: ["Entry", "Mid", "Senior"],
      },
      summary: {
        type: "string",
      },
    },
    required: [
      "experience_level",
      "summary",
    ],
  },
};

export const generateResumeSummaries = async (jobTitle) => {
  const prompt = `
Generate three professional resume summaries for the job title: "${jobTitle}".

Create exactly three summaries:

1. Entry level
2. Mid level
3. Senior level

Requirements:
- ATS-friendly
- Professional
- Concise
- Strong action-oriented language
- Suitable for a modern professional resume
- Do not mention a specific company
- Do not invent work experience
- Return exactly one summary for each experience level
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,

    config: {
      temperature: 0.6,
      topP: 0.75,
      topK: 50,
      maxOutputTokens: 2500,

      responseMimeType: "application/json",
      responseJsonSchema: SUMMARY_RESPONSE_SCHEMA,
    },
  });

  return JSON.parse(response.text);
};