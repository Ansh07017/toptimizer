
import { GoogleGenAI, Type } from "@google/genai";
import { GraphData, OptimizedPath, Weights } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getOptimizationPath = async (
  graph: GraphData,
  goal: string,
  availableTime: string,
  weights: Weights
): Promise<OptimizedPath> => {
  const model = 'gemini-3-pro-preview';
  
  const prompt = `
    Act as a graph theory and optimization expert. 
    Calculate an optimal traversal path (minimum cognitive cost) for the following student scenario:
    
    KNOWLEDGE_GRAPH: ${JSON.stringify(graph)}
    GOAL: ${goal}
    TIME_CONSTRAINT: ${availableTime}
    PRIORITY_WEIGHTS: Academic=${weights.academic}, Skill=${weights.skill}, Efficiency=${weights.efficiency}, Wellbeing=${weights.wellbeing}

    Optimization Logic:
    1. Minimize cost w(Ei, Ej) based on graph dependencies.
    2. Incorporate the Lambda (λ) multiplier for neglected importance.
    3. Return a sequence that balances the weights provided.

    Return a JSON object:
    {
      "steps": ["Task Label 1", "Task Label 2", ...],
      "totalEstimatedTime": <number in minutes>,
      "reasoning": "<mathematical justification for this path>"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            totalEstimatedTime: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
          },
          required: ["steps", "totalEstimatedTime", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    throw error;
  }
};

export const getTutorExplanation = async (topic: string): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: `Explain the topic "${topic}" to an advanced student. Break it down using the First Principles method. Focus on the mathematical or logical foundations.`,
    config: {
        systemInstruction: "You are a master scientific tutor. Your explanations are clear, rigorous, and use professional academic language."
    }
  });
  return response.text || "No synthesis available.";
};
