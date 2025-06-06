
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const TEXT_MODEL_NAME = "gemini-2.5-flash-preview-04-17";
const IMAGE_MODEL_NAME = "imagen-3.0-generate-002";

export const generateText = async (prompt: string, systemInstruction?: string): Promise<string> => {
  if (!API_KEY) return Promise.reject("API Key not configured for Gemini Service.");
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: prompt,
      config: {
        ...(systemInstruction && { systemInstruction }),
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text from Gemini:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  if (!API_KEY) return Promise.reject("API Key not configured for Gemini Service.");
  try {
    const response = await ai.models.generateImages({
      model: IMAGE_MODEL_NAME,
      prompt: prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/png' },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image generated or empty response from API.");
    }
  } catch (error) {
    console.error("Error generating image from Gemini:", error);
    throw error;
  }
};

export const generateCaptionsFromPrompt = async (videoPrompt: string): Promise<string> => {
  const captionPrompt = `Generate concise and engaging captions for a video scene described as: "${videoPrompt}". The captions should be suitable for a short video clip. Provide only the caption text.`;
  return generateText(captionPrompt, "You are an expert caption writer for social media videos.");
};

export const simulateTextToSpeech = async (text: string): Promise<string> => {
  const ttsPrompt = `A user wants to convert the following text to speech: "${text}". Respond with a very short confirmation, like "Audio simulated for: [first few words of text]..."`;
  try {
    const confirmation = await generateText(ttsPrompt, "You are a helpful assistant confirming a text-to-speech simulation.");
    return confirmation;
  } catch(error) {
    console.error("Error simulating TTS via Gemini:", error);
    return `Could not simulate audio for: "${text.substring(0,30)}..."`;
  }
};

export const generateJsonFromText = async <T,>(prompt: string, systemInstruction?: string): Promise<T> => {
  if (!API_KEY) return Promise.reject("API Key not configured for Gemini Service.");
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: prompt,
      config: {
        ...(systemInstruction && { systemInstruction }),
        responseMimeType: "application/json",
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);
    // If the expected type T is an array, and the parsed data has a single key
    // which is an array, return that inner array. This is to handle Gemini's
    // occasional wrapping of arrays in an object like {"key": []}.
    if (Array.isArray(parsedData) || typeof parsedData !== 'object' || parsedData === null) {
        return parsedData as T;
    }
    const keys = Object.keys(parsedData);
    if (keys.length === 1 && Array.isArray(parsedData[keys[0]])) {
        // Heuristic: If T is expected to be Foo[] and Gemini returns { "sub_prompts": Foo[] }, return Foo[].
        // This is a bit of a guess, might need refinement based on Gemini's typical array responses.
        return parsedData[keys[0]] as T;
    }
    return parsedData as T;

  } catch (error) {
    console.error("Error generating JSON from Gemini or parsing response:", error);
    throw error;
  }
};

export const splitLongPromptIntoSubPrompts = async (longPrompt: string): Promise<string[]> => {
  const systemInstruction = `You are an AI assistant that helps break down long video scene descriptions into a sequence of shorter, actionable prompts for an image generation model. Each prompt should describe a distinct moment or a few seconds of action from the original scene, suitable for a ~5-7 second video clip.
Maintain character consistency (names, appearances if described) and setting details across all sub-prompts.
Return a JSON array of strings, where each string is a sub-prompt. If the original prompt is already short enough for a single clip, return an array with just that single prompt.
Example: if the input describes a character walking into a room and then talking, you might return two sub-prompts: one for entering, one for talking.`;
  
  const userPrompt = `Based on the system instruction, split the following scene description into a JSON array of strings: "${longPrompt}"`;

  try {
    // Expecting a response like ["sub-prompt 1", "sub-prompt 2", ...]
    // or {"sub_prompts": ["sub-prompt 1", ...]}
    const subPrompts = await generateJsonFromText<string[]>(userPrompt, systemInstruction);
    
    if (Array.isArray(subPrompts) && subPrompts.length > 0 && subPrompts.every(s => typeof s === 'string')) {
      return subPrompts;
    }
    // Fallback if parsing didn't directly yield string[] but might be in a wrapper
    if (typeof subPrompts === 'object' && subPrompts !== null) {
        const keys = Object.keys(subPrompts as object);
        if (keys.length === 1 && Array.isArray((subPrompts as any)[keys[0]])) {
            const potentialArray = (subPrompts as any)[keys[0]];
            if (potentialArray.every(s => typeof s === 'string')) {
                return potentialArray;
            }
        }
    }
    console.warn("Sub-prompt splitting did not return a valid string array, returning original prompt as a single sub-prompt.", subPrompts);
    return [longPrompt]; // Fallback to original prompt if splitting is not as expected
  } catch (error) {
    console.error("Error splitting long prompt, using original prompt:", error);
    return [longPrompt]; // Fallback to original prompt on error
  }
};
