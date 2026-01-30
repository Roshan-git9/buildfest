
import React from 'react';

export const AwarenessEntry: React.FC = () => {
  return (
    <section className="h-full w-full flex flex-col items-center justify-center p-8 max-w-6xl mx-auto text-center">
      <div className="space-y-12 animate-in fade-in duration-1000">
        <div className="flex flex-col items-center space-y-4">
           <span className="mono text-[10px] tracking-[0.5em] text-amber-500 uppercase font-medium">Observation Protocol</span>
           <div className="h-[1px] w-24 bg-stone-800" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-light text-stone-100 tracking-tighter leading-tight max-w-4xl">
          THE ART OF <br />
          <span className="text-amber-500/90 font-medium uppercase tracking-widest text-4xl md:text-5xl block mt-4">Quiet Observation</span>
        </h1>
        
        <p className="text-stone-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed opacity-80">
          Learning doesn't fail; it drifts. We sense the patterns of engagement 
          before they become barriers. Observe, understand, then act.
        </p>

        <div className="pt-8">
           <div className="inline-flex items-center gap-4 text-stone-600 mono text-[10px] tracking-[0.2em]">
             <span className="animate-pulse">●</span>
             SCANNING SYSTEM ACTIVE
           </div>
        </div>
      </div>
    </section>
  );
};
