
import { GoogleGenAI, Type } from "@google/genai";
import { AIPerspective, AcademicMetrics } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getObservationalInsight(
  engagementData: any, 
  academicMetrics: AcademicMetrics, 
  remarks: string
): Promise<AIPerspective & { systemActions: string[] }> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze these behavioral patterns and academic data for a learner. 
    Provide a calm, non-judgmental observation and concrete recommendations for both parents and educators.
    
    Behavioral Patterns (7-day): ${JSON.stringify(engagementData)}
    Academic Metrics: ${JSON.stringify(academicMetrics)}
    Educator's Recent Remarks: "${remarks}"
    
    Guidelines:
    1. Do NOT use labels like "at risk", "failing", or "unstable".
    2. Focus on "drift", "rhythm", and "supportive alignment".
    3. The "suggestions" array is for parents/guardians (supportive, home-based).
    4. The "systemActions" array is for educators (professional, school-based interventions).
    5. Determine if the student is currently "Actively Studying" or showing "Potential Drift".
    
    The tone must be observational, precise, and supportive.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          observation: { type: Type.STRING },
          rationale: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Supportive advice for parents."
          },
          systemActions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Strategic actions for the teacher's response matrix."
          },
          isStudying: { type: Type.BOOLEAN },
          engagementScore: { type: Type.NUMBER }
        },
        required: ["observation", "rationale", "suggestions", "systemActions", "isStudying", "engagementScore"]
      }
    }
  });

  return JSON.parse(response.text.trim());
}
