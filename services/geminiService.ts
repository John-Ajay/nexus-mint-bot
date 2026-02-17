import { GoogleGenAI, Type } from "@google/genai";
import { ContractAnalysis } from "../types";

// The API key is injected via Vite's define config or environment
const apiKey = process.env.API_KEY || '';

export const analyzeContract = async (contractData: string, network: string): Promise<ContractAnalysis> => {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze this ${network} NFT contract code/address and provide a security audit. Focus on minting functions, owner privileges, and potential rug-pull mechanisms. 
    Data: ${contractData}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER, description: "Risk score from 0 (safe) to 100 (danger)" },
          functions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key functions found" },
          vulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Detected vulnerabilities" },
          summary: { type: Type.STRING, description: "Executive summary" }
        },
        required: ["riskScore", "functions", "vulnerabilities", "summary"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to receive analysis from Gemini.");
  }

  return JSON.parse(text) as ContractAnalysis;
};

export const getMintingAdvice = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert blockchain developer. Provide concise, technical advice on NFT minting strategies, gas optimization, and multi-wallet management."
    }
  });
  return response.text || "No advice available.";
};