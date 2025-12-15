import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ImageFile, PoemResult } from "../types";

// Initialize the API client
// CRITICAL: process.env.API_KEY is automatically injected.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a poem based on an image and user feelings using gemini-3-pro-preview.
 */
export const generatePoem = async (
  image: ImageFile,
  feelings: string,
  style: string,
  intensity: number
): Promise<PoemResult> => {
  try {
    const prompt = `
      You are a master poet and creative writing tutor. Your task is to write a poem that captures the essence of the provided image, filtered through the user's specific feelings.

      User Context:
      - Inner Thoughts/Feelings: "${feelings}"
      - Desired Style: "${style || 'Contemporary free verse'}"
      - Intensity Level: ${intensity}/10

      Strict Poetic Guidelines:
      1. **Avoid Clichés & Literalism**: Do not use trite rhymes (love/dove), overused metaphors, or archaic language unless the style explicitly requests it. **Never** start with "In this image" or "The picture shows".
      2. **Sensory & Tactile**: Focus on the texture, temperature, smell, and sound of the scene. Ground the emotion in physical details. Instead of saying "it was sad", describe "the cold weight of rain on wool" or "the silence of a locked door".
      3. **Atmosphere & Intensity**: 
         - If Intensity is Low (1-4): Be subtle, quiet, observational, understated. Use whitespace and pause.
         - If Intensity is High (7-10): Be visceral, urgent, passionate, overwhelming. Use strong verbs and driving rhythm.
      4. **Show, Don't Tell**: Create an evocative experience. Weave the user's thoughts into the imagery of the photo naturally.
      
      Output Format:
      Return strictly JSON with "title" and "content" fields.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: image.mimeType,
              data: image.base64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
          },
          required: ["title", "content"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from model");
    return JSON.parse(text) as PoemResult;
  } catch (error) {
    console.error("Poem generation error:", error);
    throw error;
  }
};

/**
 * Analyzes an image using gemini-3-pro-preview.
 */
export const analyzeImage = async (image: ImageFile): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: image.mimeType,
              data: image.base64,
            },
          },
          { text: "Analyze this image in detail. Describe the composition, colors, mood, and potential symbolism." },
        ],
      },
    });
    return response.text || "Could not analyze image.";
  } catch (error) {
    console.error("Image analysis error:", error);
    throw error;
  }
};

/**
 * Generates speech from text using gemini-2.5-flash-preview-tts.
 */
export const generateSpeech = async (textToSpeak: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: {
        parts: [{ text: textToSpeak }],
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Puck" }, // Using a neutral/pleasant voice
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
      throw new Error("No audio data received from model");
    }
    return audioData;
  } catch (error) {
    console.error("TTS error:", error);
    throw error;
  }
};

/**
 * Chats with the bot using gemini-3-pro-preview.
 */
export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};