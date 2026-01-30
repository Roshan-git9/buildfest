
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AIPerspective } from '../types';

interface Props {
  insight: AIPerspective | null;
}

export const VintageAestheticTile: React.FC<Props> = ({ insight }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(false);

  const loadingMessages = [
    "Developing film grain...",
    "Adjusting exposure curves...",
    "Capturing nostalgia...",
    "Applying warm tint...",
    "Rendering vintage finish..."
  ];

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore - window.aistudio is injected
      const selected = await window.aistudio?.hasSelectedApiKey();
      setHasApiKey(!!selected);
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    await window.aistudio?.openSelectKey();
    setHasApiKey(true);
  };

  const generateImage = async () => {
    if (!insight) return;
    setIsGenerating(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const mood = insight.isStudying ? "serene and focused" : "dreamy and drifting";
      const basePrompt = `A high-quality vintage photograph with a ${mood} atmosphere. Warm film grain, nostalgic 1970s aesthetic, faded colors, cinematic lighting, soft focus, 35mm film style. The subject is an abstract representation of calm and nostalgia. Highly detailed, aesthetic composition.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: basePrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          setImageUrl(`data:image/png;base64,${base64EncodeString}`);
          break;
        }
      }
    } catch (error: any) {
      console.error("Image Generation Error:", error);
      if (error?.message?.includes("entity was not found")) {
        setHasApiKey(false);
        alert("Please re-select your API key to continue.");
      }
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="tile lg:col-span-5 p-6 flex flex-col h-[500px] relative overflow-hidden group">
      <div className="tile-header">
        <span>Vintage Aesthetic Visuals</span>
        <span className="mono text-[8px] opacity-40">Gemini Image Engine</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative bg-black/40 rounded border border-stone-800/40 overflow-hidden">
        {!hasApiKey ? (
          <div className="text-center p-8 space-y-6">
            <div className="w-12 h-12 rounded-full border border-stone-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <p className="text-stone-400 text-sm italic font-light">Secure intelligence required for aesthetic generation.</p>
            <button 
              onClick={handleOpenKeySelector}
              className="liquid-button px-6 py-2 bg-stone-100/5 border border-white/10 text-stone-300 mono text-[10px] tracking-widest hover:bg-white/10 transition-all uppercase rounded-lg"
            >
              Unlock Engine
            </button>
          </div>
        ) : isGenerating ? (
          <div className="text-center space-y-6 animate-pulse">
            <div className="relative w-16 h-16 mx-auto">
               <div className="absolute inset-0 border-2 border-stone-800 rounded-full"></div>
               <div className="absolute inset-0 border-2 border-stone-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <p className="text-stone-300 font-light italic">{loadingMessages[loadingStep]}</p>
              <p className="text-stone-600 mono text-[9px] uppercase tracking-tighter">Gemini 2.5: Developing Image</p>
            </div>
          </div>
        ) : imageUrl ? (
          <div className="w-full h-full relative group/img">
            <img 
              src={imageUrl} 
              alt="Vintage Aesthetic"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
               <button 
                onClick={generateImage}
                className="liquid-button px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white mono text-[10px] tracking-widest uppercase hover:bg-white/20 rounded-full"
               >
                 Capture New Moment
               </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 space-y-4">
             <div className="text-4xl font-extralight text-stone-700 tracking-tighter mb-4 uppercase">Vintage Atmosphere</div>
             <p className="text-stone-500 text-xs font-light max-w-xs mx-auto mb-6">
               Synthesize a personalized vintage aesthetic image reflecting the current cognitive rhythm.
             </p>
             <button 
              onClick={generateImage}
              disabled={!insight}
              className="liquid-button px-10 py-3 bg-stone-100 text-stone-900 font-medium text-[10px] tracking-widest hover:bg-white transition-all uppercase disabled:opacity-20 rounded-full"
             >
               Generate Vintage
             </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-[8px] mono text-stone-600 tracking-widest">
        <span>MODE: AESTHETIC_RECALL</span>
        <span>FORMAT: ANALOG_OPTIMIZED</span>
      </div>
    </div>
  );
};
