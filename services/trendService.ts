
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTrendInsights = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the YouTube search trends for the topic "${topic}" in Indonesia for the last 24 hours. Provide a detailed summary and future predictions.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error (Insights):", error);
    return "Could not load insights at this time.";
  }
};

export const getRelatedData = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a JSON object containing related topics and related queries for "${topic}" on YouTube Indonesia. Category: Arts & Entertainment.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING },
                  value: { type: Type.STRING },
                  trend: { type: Type.STRING }
                },
                required: ["title", "type", "value", "trend"]
              }
            },
            queries: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  query: { type: Type.STRING },
                  value: { type: Type.STRING },
                  trend: { type: Type.STRING }
                },
                required: ["query", "value", "trend"]
              }
            }
          },
          required: ["topics", "queries"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error (Related Data):", error);
    // Mengembalikan data fallback jika API gagal agar UI tetap memiliki konten
    return {
      topics: [
        { title: "Trending Music", type: "Topic", value: "Breakout", trend: "rising" },
        { title: "Viral Shorts", type: "Topic", value: "150", trend: "rising" }
      ],
      queries: [
        { query: "lagu viral 2024", value: "Breakout", trend: "rising" },
        { query: "video lucu", value: "200", trend: "rising" }
      ]
    };
  }
};
