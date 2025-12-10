import { GoogleGenAI } from "@google/genai";
import { Participant } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAutoMessage = async (participant: Participant, type: 'welcome' | 'refund'): Promise<string> => {
  const modelId = 'gemini-2.5-flash';

  let prompt = "";
  
  if (type === 'refund') {
    prompt = `Write a polite, short, and professional refund notification message for an event participant named ${participant.name}. 
    Context: They bought a ticket via the ${participant.source}.
    Tone: Empathetic but firm. Max 50 words.`;
  } else {
    prompt = `Write a short, hype-filled welcome message for an event participant named ${participant.name} (Age: ${participant.age}). 
    Context: We are matching them to a table. 
    Interests: ${participant.interests.join(', ')}.
    Tone: Excited, casual, Gen-Z friendly. Max 40 words.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    
    return response.text || "Could not generate message.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating message. Please check API key.";
  }
};